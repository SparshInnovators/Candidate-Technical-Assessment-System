<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technical Assessment - Language Selection</title>
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
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }

        .container {
            background: white;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            padding: 40px;
            max-width: 600px;
            width: 100%;
        }

        .header {
            text-align: center;
            margin-bottom: 30px;
        }

        .header h1 {
            color: #333;
            font-size: 2.5rem;
            margin-bottom: 10px;
        }

        .header p {
            color: #666;
            font-size: 1.1rem;
        }

        .language-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }

        .language-option {
            position: relative;
        }

        .language-option input {
            display: none;
        }

        .language-option label {
            display: block;
            padding: 20px;
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            font-weight: 600;
            color: #495057;
        }

        .language-option input:checked + label {
            background: #007bff;
            color: white;
            border-color: #007bff;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0,123,255,0.3);
        }

        .language-option label:hover {
            border-color: #007bff;
            transform: translateY(-2px);
        }

        .btn {
            background: #28a745;
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 1.1rem;
            border-radius: 8px;
            cursor: pointer;
            width: 100%;
            transition: background 0.3s ease;
            font-weight: 600;
        }

        .btn:hover {
            background: #218838;
        }

        .btn:disabled {
            background: #6c757d;
            cursor: not-allowed;
        }

        .error {
            color: #dc3545;
            text-align: center;
            margin-bottom: 15px;
            padding: 10px;
            background: #f8d7da;
            border: 1px solid #f5c6cb;
            border-radius: 5px;
        }

        .selected-count {
            text-align: center;
            margin-bottom: 15px;
            color: #666;
            font-size: 0.9rem;
        }

        @media (max-width: 768px) {
            .container {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .language-grid {
                grid-template-columns: 1fr 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Technical Assessment</h1>
            <p>Select your preferred programming languages to begin the test</p>
        </div>

        @if(session('error'))
            <div class="error">
                {{ session('error') }}
            </div>
        @endif

        <form id="languageForm" action="{{ route('start.assessment') }}" method="POST">
            @csrf
            
            <div class="selected-count">
                Selected: <span id="selectedCount">0</span> languages
            </div>

            <div class="language-grid">
                @foreach($languages as $language)
                    <div class="language-option">
                        <input type="checkbox" name="languages[]" value="{{ $language }}" id="lang-{{ $loop->index }}">
                        <label for="lang-{{ $loop->index }}">{{ $language }}</label>
                    </div>
                @endforeach
            </div>

            <button type="submit" class="btn" id="startBtn" disabled>Start Assessment</button>
        </form>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            const startBtn = document.getElementById('startBtn');
            const selectedCount = document.getElementById('selectedCount');

            function updateSelection() {
                const selected = Array.from(checkboxes).filter(cb => cb.checked).length;
                selectedCount.textContent = selected;
                startBtn.disabled = selected === 0;
            }

            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', updateSelection);
            });

            // Initial update
            updateSelection();
        });
    </script>
</body>
</html>