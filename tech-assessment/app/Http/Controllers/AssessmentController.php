<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Question;
use App\Models\Assessment;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;


class AssessmentController extends Controller
{
    private $questionsPerLanguage = 3;
    private $passingThreshold = 0.6;

    public function showLanguageSelection()
    {
        $languages = Question::distinct()->pluck('language');
        return view('language-selection', compact('languages'));
    }

    public function startAssessment(Request $request)
    {
        $request->validate([
            'languages' => 'required|array|min:1',
            'languages.*' => 'string'
        ]);

        $sessionId = Str::uuid();
        $selectedLanguages = $request->languages;

        // Get random questions from selected languages
        $questions = Question::byLanguage($selectedLanguages)
            ->randomized()
            ->limit(count($selectedLanguages) * $this->questionsPerLanguage)
            ->get();

        if ($questions->isEmpty()) {
            return back()->with('error', 'No questions available for selected languages.');
        }

        // Create assessment session
        Assessment::create([
            'session_id' => $sessionId,
            'selected_languages' => $selectedLanguages,
            'total_questions' => $questions->count(),
            'started_at' => now()
        ]);

        // Store questions in session
        session([$sessionId . '_questions' => $questions]);

        return redirect()->route('show.assessment', $sessionId);
    }

    public function showAssessment($sessionId)
    {
        $assessment = Assessment::where('session_id', $sessionId)->firstOrFail();
        
        if ($assessment->completed) {
            return redirect()->route('show.results', $sessionId);
        }

        $questions = session($sessionId . '_questions');
        
        if (!$questions) {
            return redirect('/')->with('error', 'Session expired. Please start again.');
        }

        $currentQuestionIndex = $assessment->answers ? count($assessment->answers) : 0;
        
        if ($currentQuestionIndex >= $questions->count()) {
            return redirect()->route('show.results', $sessionId);
        }

        $currentQuestion = $questions[$currentQuestionIndex];
        $progress = $questions->count() > 0 ? (($currentQuestionIndex + 1) / $questions->count()) * 100 : 0;

        return view('assessment', compact(
            'assessment',
            'currentQuestion',
            'currentQuestionIndex',
            'questions',
            'progress'
        ));
    }

    public function saveAnswer(Request $request, $sessionId)
    {
        $assessment = Assessment::where('session_id', $sessionId)->firstOrFail();
        $questions = session($sessionId . '_questions');

        $request->validate([
            'question_id' => 'required|integer',
            'answer' => 'required|string'
        ]);

        $currentAnswers = $assessment->answers ?? [];
        $currentAnswers[$request->question_id] = $request->answer;

        $assessment->update([
            'answers' => $currentAnswers
        ]);

        $nextQuestionIndex = count($currentAnswers);
        
        if ($nextQuestionIndex >= $questions->count()) {
            return $this->submitAssessment(new Request(), $sessionId);
        }

        return redirect()->route('show.assessment', $sessionId);
    }

    public function submitAssessment(Request $request, $sessionId)
    {
        $assessment = Assessment::where('session_id', $sessionId)->firstOrFail();
        $questions = session($sessionId . '_questions');

        $score = $assessment->calculateScore($assessment->answers ?? [], $questions);

        $assessment->update([
            'score' => $score,
            'completed' => true,
            'completed_at' => now()
        ]);

        return redirect()->route('show.results', $sessionId);
    }

    public function showResults($sessionId)
    {
        $assessment = Assessment::where('session_id', $sessionId)->firstOrFail();
        $questions = session($sessionId . '_questions');

        if (!$assessment->completed) {
            return redirect()->route('show.assessment', $sessionId);
        }

        $passed = $assessment->isPassed($this->passingThreshold);
        $scorePercentage = $assessment->total_questions > 0 
            ? round(($assessment->score / $assessment->total_questions) * 100, 2)
            : 0;

        return view('results', compact(
            'assessment',
            'questions',
            'passed',
            'scorePercentage'
        ));
    }

    public function uploadResume(Request $request, $sessionId)
    {
        $assessment = Assessment::where('session_id', $sessionId)->firstOrFail();

        if (!$assessment->isPassed($this->passingThreshold)) {
            return back()->with('error', 'You must pass the assessment to upload resume.');
        }

        $request->validate([
            'resume' => 'required|file|mimes:pdf,doc,docx|max:2048'
        ]);

        $path = $request->file('resume')->store('resumes', 'public');

        $assessment->update([
            'resume_path' => $path
        ]);

        return back()->with('success', 'Resume uploaded successfully!');
    }
}