<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AssessmentController;
Route::get('/', function () {
    return view('welcome');
});
Route::get('/', [AssessmentController::class, 'showLanguageSelection'])->name('home');
Route::post('/start-assessment', [AssessmentController::class, 'startAssessment'])->name('start.assessment');
Route::get('/assessment/{sessionId}', [AssessmentController::class, 'showAssessment'])->name('show.assessment');
Route::post('/assessment/{sessionId}/answer', [AssessmentController::class, 'saveAnswer'])->name('save.answer');
Route::post('/assessment/{sessionId}/submit', [AssessmentController::class, 'submitAssessment'])->name('submit.assessment');
Route::get('/assessment/{sessionId}/results', [AssessmentController::class, 'showResults'])->name('show.results');
Route::post('/assessment/{sessionId}/upload-resume', [AssessmentController::class, 'uploadResume'])->name('upload.resume');