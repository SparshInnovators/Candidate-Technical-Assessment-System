<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Question extends Model
{
     use HasFactory;
    protected $fillable = [
        'question',
        'options',
        'correct_answer',
        'language',
        'difficulty'
    ];

    protected $casts = [
        'options' => 'array'
    ];

    public function scopeByLanguage($query, $languages)
    {
        return $query->whereIn('language', $languages);
    }

    public function scopeRandomized($query)
    {
        return $query->inRandomOrder();
    }
}