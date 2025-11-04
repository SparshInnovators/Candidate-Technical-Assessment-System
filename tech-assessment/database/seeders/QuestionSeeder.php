<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Question;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $questions = [
            'JavaScript' => [
                [
                    'question' => 'What is the output of: console.log(typeof typeof 1)?',
                    'options' => ['number', 'string', 'undefined', 'object'],
                    'correct_answer' => 'string',
                    'difficulty' => 2
                ],
                [
                    'question' => 'What is a closure in JavaScript?',
                    'options' => [
                        'A function that has access to variables in its outer scope',
                        'A way to close a browser window',
                        'A method for memory management',
                        'A type of loop'
                    ],
                    'correct_answer' => 'A function that has access to variables in its outer scope',
                    'difficulty' => 3
                ],
                [
                    'question' => 'Which method creates a new array with results of calling a function on every element?',
                    'options' => ['map()', 'forEach()', 'reduce()', 'filter()'],
                    'correct_answer' => 'map()',
                    'difficulty' => 1
                ],
                [
                    'question' => 'What does "this" refer to in a JavaScript method?',
                    'options' => ['The function itself', 'The global object', 'The object that owns the method', 'The parent object'],
                    'correct_answer' => 'The object that owns the method',
                    'difficulty' => 2
                ],
                [
                    'question' => 'Which is NOT a JavaScript data type?',
                    'options' => ['undefined', 'number', 'float', 'symbol'],
                    'correct_answer' => 'float',
                    'difficulty' => 1
                ]
            ],
            'Python' => [
                [
                    'question' => 'What is the difference between list and tuple in Python?',
                    'options' => [
                        'List is mutable, tuple is immutable',
                        'Tuple is mutable, list is immutable',
                        'Both are mutable',
                        'Both are immutable'
                    ],
                    'correct_answer' => 'List is mutable, tuple is immutable',
                    'difficulty' => 2
                ],
                [
                    'question' => 'How do you create a virtual environment in Python?',
                    'options' => [
                        'python -m venv env',
                        'virtualenv create env',
                        'python create env',
                        'venv python env'
                    ],
                    'correct_answer' => 'python -m venv env',
                    'difficulty' => 1
                ],
                [
                    'question' => 'What does the "self" parameter refer to in Python class methods?',
                    'options' => [
                        'The class instance',
                        'The parent class',
                        'The module',
                        'The global scope'
                    ],
                    'correct_answer' => 'The class instance',
                    'difficulty' => 2
                ],
                [
                    'question' => 'Which is used to handle exceptions in Python?',
                    'options' => ['try-except', 'catch-throw', 'error-handle', 'exception-catch'],
                    'correct_answer' => 'try-except',
                    'difficulty' => 1
                ],
                [
                    'question' => 'What is the output of: [x**2 for x in range(5)]?',
                    'options' => ['[0, 1, 4, 9, 16]', '[1, 4, 9, 16, 25]', '[0, 1, 2, 3, 4]', '[1, 2, 3, 4, 5]'],
                    'correct_answer' => '[0, 1, 4, 9, 16]',
                    'difficulty' => 2
                ]
            ],
            'PHP' => [
                [
                    'question' => 'What does PHP stand for?',
                    'options' => [
                        'PHP: Hypertext Preprocessor',
                        'Private Home Page',
                        'Personal Hypertext Processor',
                        'Program Hypertext Protocol'
                    ],
                    'correct_answer' => 'PHP: Hypertext Preprocessor',
                    'difficulty' => 1
                ],
                [
                    'question' => 'Which superglobal variable contains information about headers, paths, and script locations?',
                    'options' => ['$_SERVER', '$_GLOBALS', '$_SESSION', '$_ENV'],
                    'correct_answer' => '$_SERVER',
                    'difficulty' => 2
                ],
                [
                    'question' => 'How do you start a session in PHP?',
                    'options' => ['session_start()', 'start_session()', 'session_begin()', 'init_session()'],
                    'correct_answer' => 'session_start()',
                    'difficulty' => 1
                ],
                [
                    'question' => 'Which function is used to prevent SQL injection?',
                    'options' => ['mysqli_real_escape_string()', 'escape_string()', 'sql_escape()', 'prevent_sql()'],
                    'correct_answer' => 'mysqli_real_escape_string()',
                    'difficulty' => 3
                ],
                [
                    'question' => 'What is the correct way to create a constant in PHP?',
                    'options' => ['define("CONSTANT", value)', 'const CONSTANT = value', 'Both A and B', 'None of the above'],
                    'correct_answer' => 'Both A and B',
                    'difficulty' => 2
                ]
            ]
        ];

        foreach ($questions as $language => $languageQuestions) {
            foreach ($languageQuestions as $questionData) {
                Question::create(array_merge($questionData, ['language' => $language]));
            }
        }
    }
    }