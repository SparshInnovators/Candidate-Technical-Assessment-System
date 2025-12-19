<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;

Route::get('/', function () {
    return view('welcome'); // Language selection page
});

Route::post('/start-test', [TestController::class, 'startTest']);

Route::get('/test', [TestController::class, 'showQuestion']);

Route::post('/answer', [TestController::class, 'saveAnswer']);

Route::get('/result', [TestController::class, 'showResult']);

Route::post('/upload-resume', [TestController::class, 'uploadResume']);
