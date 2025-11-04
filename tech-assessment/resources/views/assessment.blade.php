<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technical Assessment - Question {{ $currentQuestionIndex + 1 }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .header {
            background: #343a40;
            color: white;
            padding: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 10px;
        }

        .progress-bar {
            background: #495057;
            height: 8px;
            border-radius: 4px;
            overflow: hidden;
            margin: 10px 0;
        }

        .progress-fill {
            background: #007bff;
            height: 100%;
            transition: width 0.3s ease;
        }

        .question-container {
            padding: 30px;
        }

        .question-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            flex-wrap: wrap;
            gap: 10px;
        }

        .question-number {
            color: #007bff;
            font-size: 1.2rem;
            font-weight: 600;
        }

        .language-tag {
            background: #e9ecef;
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.9rem;
            color: #495057;
        }

        .question-text {
            font-size: 1.3rem;
            line-height: 1.6;
            margin-bottom: 30px;
            color: #333;
        }

        .options-container {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 30px;
        }

        .option {
            display: flex;
            align-items: flex-start;
            gap: 15px;
            padding: 20px;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .option:hover {
            border-color: #007bff;
            background: #f8f9fa;
        }

        .option.selected {
            border-color: #007bff;
            background: #e7f1ff;
        }

        .option input {
            margin-top: 2px;
        }

        .option-label {
            font-weight: 500;
            color: #495057;
            line-height: 1.5;
        }

        .navigation {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px 30px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
        }

        .btn {
            padding: 12px 25px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
        }

        .btn-primary {
            background: #007bff;
            color: white;
        }

        .btn-primary:hover {
            background: #0056b3;
        }

        .btn-success {
            background: #28a745;
            color: white;
        }

        .btn-success:hover {
            background: #218838;
        }

        .btn:disabled {
            background: #6c757d;
            cursor: not-allowed;
        }

        .progress-text {
            color: #666;
            font-size: 0.9rem;
        }

        @media (max-width: 768px) {
            .container {
                margin: 10px;
            }
            
            .question-container {
                padding: 20px;
            }
            
            .header {
                flex-direction: column;
                align-items: flex-start;
            }
            
            .navigation {
                flex-direction: column;
                gap: 10px;
            }
            
            .btn {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div>
                <h2>Technical Assessment</h2>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {{ $progress }}%"></div>
                </div>
            </div>
            <div class="progress-text">
                Question {{ $currentQuestionIndex + 1 }} of {{ $questions->count() }}
            </div>
        </div>

        <form id="answerForm" action="{{ route('save.answer', $assessment->session_id) }}" method="POST">
            @csrf
            <input type="hidden" name="question_id" value="{{ $currentQuestion->id }}">
            
            <div class="question-container">
                <div class="question-header">
                    <div class="question-number">Question {{ $currentQuestionIndex + 1 }}</div>
                    <div class="language-tag">{{ $currentQuestion->language }}</div>
                </div>
                
                <div class="question-text">
                    {{ $currentQuestion->question }}
                </div>

                <div class="options-container">
                    @foreach($currentQuestion->options as $index => $option)
                        <div class="option" onclick="selectOption(this)">
                            <input type="radio" name="answer" value="{{ $option }}" id="option{{ $index }}">
                            <label for="option{{ $index }}" class="option-label">{{ $option }}</label>
                        </div>
                    @endforeach
                </div>
            </div>

            <div class="navigation">
                <div class="progress-text">
                    Progress: {{ round($progress) }}%
                </div>
                <button type="submit" class="btn btn-primary" id="submitBtn" disabled>
                    {{ $currentQuestionIndex + 1 === $questions->count() ? 'Submit Assessment' : 'Next Question' }}
                </button>
            </div>
        </form>
    </div>

    <script>
        function selectOption(optionElement) {
            // Remove selected class from all options
            document.querySelectorAll('.option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Add selected class to clicked option
            optionElement.classList.add('selected');
            
            // Check the radio button
            const radio = optionElement.querySelector('input[type="radio"]');
            radio.checked = true;
            
            // Enable submit button
            document.getElementById('submitBtn').disabled = false;
        }

        // Auto-save on option select
        document.querySelectorAll('input[name="answer"]').forEach(radio => {
            radio.addEventListener('change', function() {
                document.getElementById('submitBtn').disabled = false;
            });
        });

        // Prevent form resubmission
        if (window.history.replaceState) {
            window.history.replaceState(null, null, window.location.href);
        }
    </script>
</body>
</html>