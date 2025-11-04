<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Assessment extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'selected_languages',
        'answers',
        'score',
        'total_questions',
        'completed',
        'resume_path',
        'started_at',
        'completed_at'
    ];

    protected $casts = [
        'selected_languages' => 'array',
        'answers' => 'array',
        'started_at' => 'datetime',
        'completed_at' => 'datetime'
    ];

    public function calculateScore($userAnswers, $questions)
    {
        $score = 0;
        
        foreach ($userAnswers as $questionId => $userAnswer) {
            $question = $questions->firstWhere('id', $questionId);
            if ($question && $question->correct_answer === $userAnswer) {
                $score++;
            }
        }

        return $score;
    }

    public function isPassed($threshold = 0.6)
    {
        return ($this->score / $this->total_questions) >= $threshold;
    }
}