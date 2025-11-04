<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Assessment Results</title>
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
            padding: 30px;
            text-align: center;
        }

        .results-container {
            padding: 40px;
        }

        .score-card {
            text-align: center;
            margin-bottom: 40px;
            padding: 30px;
            border-radius: 10px;
            background: #f8f9fa;
        }

        .score-circle {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background: {{ $passed ? '#28a745' : '#dc3545' }};
            color: white;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 2rem;
            font-weight: bold;
        }

        .score-text {
            font-size: 1.5rem;
            margin-bottom: 10px;
            color: #333;
        }

        .result-message {
            font-size: 1.2rem;
            color: #666;
            margin-bottom: 20px;
        }

        .upload-section {
            background: #e7f3ff;
            padding: 30px;
            border-radius: 10px;
            margin-bottom: 30px;
            text-align: center;
            border: 2px dashed #007bff;
        }

        .upload-section h3 {
            color: #007bff;
            margin-bottom: 15px;
        }

        .upload-form {
            max-width: 400px;
            margin: 0 auto;
        }

        .file-input {
            width: 100%;
            padding: 15px;
            border: 2px solid #007bff;
            border-radius: 8px;
            margin-bottom: 15px;
            background: white;
        }

        .btn {
            padding: 15px 30px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
            text-align: center;
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

        .details-section {
            margin-top: 30px;
        }

        .detail-item {
            display: flex;
            justify-content: space-between;
            padding: 15px;
            border-bottom: 1px solid #e9ecef;
        }

        .detail-label {
            font-weight: 600;
            color: #333;
        }

        .detail-value {
            color: #666;
        }

        .success-message {
            background: #d4edda;
            color: #155724;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
            border: 1px solid #c3e6cb;
        }

        .try-again {
            text-align: center;
            padding: 30px;
            background: #f8d7da;
            color: #721c24;
            border-radius: 10px;
            margin-bottom: 20px;
        }

        @media (max-width: 768px) {
            .container {
                margin: 10px;
            }
            
            .results-container {
                padding: 20px;
            }
            
            .score-circle {
                width: 120px;
                height: 120px;
                font-size: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Assessment Results</h1>
            <p>Your technical assessment has been completed</p>
        </div>

        <div class="results-container">
            <div class="score-card">
                <div class="score-circle">
                    {{ $assessment->score }}/{{ $assessment->total_questions }}
                </div>
                <div class="score-text">
                    {{ $scorePercentage }}% Correct
                </div>
                <div class="result-message">
                    @if($passed)
                        🎉 Congratulations! You passed the assessment.
                    @else
                        Keep practicing! You can try again later.
                    @endif
                </div>
            </div>

            @if($passed)
                @if($assessment->resume_path)
                    <div class="success-message">
                        ✅ Your resume has been uploaded successfully!
                    </div>
                @else
                    <div class="upload-section">
                        <h3>Upload Your Resume</h3>
                        <p>Congratulations on passing the assessment! Please upload your resume to proceed with the application process.</p>
                        
                        <form action="{{ route('upload.resume', $assessment->session_id) }}" method="POST" enctype="multipart/form-data" class="upload-form">
                            @csrf
                            <input type="file" name="resume" class="file-input" accept=".pdf,.doc,.docx" required>
                            <button type="submit" class="btn btn-success">Upload Resume</button>
                        </form>
                        
                        <p style="margin-top: 10px; font-size: 0.9rem; color: #666;">
                            Accepted formats: PDF, DOC, DOCX (Max: 2MB)
                        </p>
                    </div>
                @endif
            @else
                <div class="try-again">
                    <h3>Thank You for Your Participation</h3>
                    <p>Unfortunately, your score didn't meet the passing criteria. You can try again after some practice.</p>
                </div>
            @endif

            <div class="details-section">
                <h3 style="margin-bottom: 20px; color: #333;">Assessment Details</h3>
                
                <div class="detail-item">
                    <span class="detail-label">Selected Languages:</span>
                    <span class="detail-value">{{ implode(', ', $assessment->selected_languages) }}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Total Questions:</span>
                    <span class="detail-value">{{ $assessment->total_questions }}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Correct Answers:</span>
                    <span class="detail-value">{{ $assessment->score }}</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Score Percentage:</span>
                    <span class="detail-value">{{ $scorePercentage }}%</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Passing Threshold:</span>
                    <span class="detail-value">60%</span>
                </div>
                
                <div class="detail-item">
                    <span class="detail-label">Status:</span>
                    <span class="detail-value" style="color: {{ $passed ? '#28a745' : '#dc3545' }}; font-weight: 600;">
                        {{ $passed ? 'PASSED' : 'NOT PASSED' }}
                    </span>
                </div>
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <a href="{{ route('home') }}" class="btn btn-primary">Start New Assessment</a>
            </div>
        </div>
    </div>
</body>
</html>