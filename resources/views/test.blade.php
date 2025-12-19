<!DOCTYPE html>
<html>
<head>
    <title>Test</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">
<div class="container mt-5">
    <div class="card">
        <div class="card-header">
            <h4>Question {{ $questionNumber }} of {{ $totalQuestions }}</h4>
            <div class="progress">
                <div class="progress-bar" style="width: {{ ($questionNumber / $totalQuestions) * 100 }}%"></div>
            </div>
        </div>
        <div class="card-body">
            <h5>{{ $question['question'] }}</h5>
            <form method="POST" action="/answer">
                @csrf
                <input type="hidden" name="action" value="next">

                @foreach($question['options'] as $i => $option)
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="answer" value="{{ $i }}"
                               id="option{{ $i }}" {{ $answered == $i ? 'checked' : '' }}>
                        <label class="form-check-label" for="option{{ $i }}">{{ $option }}</label>
                    </div>
                @endforeach

                <div class="mt-4 d-flex justify-content-between">
                    @if($questionNumber > 1)
                        <button type="submit" name="action" value="prev" class="btn btn-secondary">Previous</button>
                    @else
                        <div></div>
                    @endif

                    @if($questionNumber == $totalQuestions)
                        <button type="submit" name="action" value="finish" class="btn btn-success">Finish Test</button>
                    @else
                        <button type="submit" class="btn btn-primary">Next</button>
                    @endif
                </div>
            </form>
        </div>
    </div>
</div>
</body>
</html>
