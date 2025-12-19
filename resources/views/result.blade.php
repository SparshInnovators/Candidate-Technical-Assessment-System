<!DOCTYPE html>
<html>
<head>
    <title>Result</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container mt-5">
    <div class="card">
        <div class="card-body text-center">
            <h2>Your Score: {{ $score }} / {{ $total }} ({{ $percentage }}%)</h2>

            @if(session('success'))
                <div class="alert alert-success">{{ session('success') }}</div>
            @endif

            @if($passed)
                <div class="alert alert-success">Congratulations! You passed!</div>

                <form action="/upload-resume" method="POST" enctype="multipart/form-data" class="mt-4">
                    @csrf
                    <label>Upload Your Resume (PDF, DOC, DOCX)</label>
                    <input type="file" name="resume" class="form-control mb-3" required>
                    <button class="btn btn-lg btn-primary">Upload Resume</button>
                </form>
            @else
                <div class="alert alert-danger">Sorry, you did not pass. Try again later.</div>
            @endif

            <a href="/" class="btn btn-link mt-3">Back to Start</a>
        </div>
    </div>
</div>
</body>
</html>
