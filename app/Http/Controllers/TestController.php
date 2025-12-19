<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class TestController extends Controller
{
    public function startTest(Request $request)
    {
        $request->validate([
            'languages' => 'required|array|min:1'
        ]);

        // Save selected languages
        session(['languages' => $request->languages]);

        // Load questions from JSON file
        $questionsJson = file_get_contents(storage_path('app/questions.json'));
        $allQuestions = json_decode($questionsJson, true);

        // Pick 5 random questions per selected language
        $testQuestions = [];
        foreach ($request->languages as $lang) {
            if (isset($allQuestions[$lang])) {
                $langQuestions = $allQuestions[$lang];
                shuffle($langQuestions);
                $testQuestions = array_merge($testQuestions, array_slice($langQuestions, 0, 5));
            }
        }

        shuffle($testQuestions);

        // Save questions and reset answers
        session([
            'questions' => $testQuestions,
            'answers' => [],
            'current' => 0
        ]);

        return redirect('/test');
    }

    // Step 2: Show current question
    public function showQuestion()
    {
        if (!session('questions')) {
            return redirect('/');
        }

        $questions = session('questions');
        $current = session('current', 0);

        if ($current >= count($questions)) {
            return redirect('/result');
        }

        $question = $questions[$current];
        $answered = session("answers.$current");

        return view('test', [
            'question' => $question,
            'questionNumber' => $current + 1,
            'totalQuestions' => count($questions),
            'answered' => $answered
        ]);
    }

    // Step 3: Save answer and go next/prev
    public function saveAnswer(Request $request)
    {
        $action = $request->action;
        $answer = $request->answer ?? null;

        $current = session('current', 0);
        $questions = session('questions');

        // Save the answer
        if ($answer !== null) {
            session(["answers.$current" => (int)$answer]);
        }

        // Change question number
        if ($action == 'next') {
            $current++;
        } elseif ($action == 'prev') {
            $current--;
        } elseif ($action == 'finish') {
            return redirect('/result');
        }

        // Make sure current is valid
        if ($current < 0) $current = 0;
        if ($current >= count($questions)) {
            return redirect('/result');
        }

        session(['current' => $current]);

        return redirect('/test');
    }

    // Step 4: Show result
    public function showResult()
    {
        $questions = session('questions');
        $answers = session('answers', []);

        if (!$questions) {
            return redirect('/');
        }

        $score = 0;
        foreach ($questions as $index => $q) {
            if (isset($answers[$index]) && $answers[$index] == $q['correctAnswer']) {
                $score++;
            }
        }

        $total = count($questions);
        $percentage = $total > 0 ? round(($score / $total) * 100) : 0;
        $passed = $percentage >= 70;

        // Save pass status for upload
        session(['passed' => $passed]);

        return view('result', compact('score', 'total', 'percentage', 'passed'));
    }

    // Step 5: Upload resume
    public function uploadResume(Request $request)
    {
        if (!session('passed')) {
            return redirect('/result')->with('error', 'You cannot upload resume.');
        }

        $request->validate([
            'resume' => 'required|file|mimes:pdf,doc,docx|max:2048' // max 2MB
        ]);

        $request->file('resume')->store('resumes');

        // Clear session after upload
        session()->forget(['questions', 'answers', 'current', 'languages', 'passed']);

        return redirect('/result')->with('success', 'Resume uploaded successfully! We will contact you soon.');
    }
}
