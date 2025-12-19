<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Technical Assessment</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- Bootstrap -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">

    <!-- Devicon -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/devicon@2.15.1/devicon.min.css">
</head>

<body class="bg-light d-flex align-items-center min-vh-100">

<div class="container">
    <div class="row justify-content-center">
        <div class="col-lg-8 col-md-10">

            <div class="card shadow-lg rounded-4 p-4 p-md-5">

                <h2 class="text-center fw-bold mb-2">
                    Technical Assessment
                </h2>
                <p class="text-center text-muted mb-4">
                    Select the programming languages
                </p>

                <!-- Selected Languages -->
                <div class="alert alert-primary">
                    <strong>Selected:</strong>
                    <span id="selectedLanguages">None</span>
                </div>

                <form method="POST" action="/start-test">
                    @csrf

                    <div class="row g-4">

                        <!-- Language Card -->
                        <div class="col-6 col-md-4">
                            <div class="card text-center h-100 language-card"
                                 data-lang="JavaScript">
                                <div class="card-body position-relative">

                                    <span class="badge bg-primary position-absolute top-0 end-0 m-2 d-none">
                                        ✓
                                    </span>

                                    <input type="checkbox"
                                           name="languages[]"
                                           value="JavaScript"
                                           class="d-none">

                                    <i class="devicon-javascript-plain colored fs-1"></i>
                                    <h6 class="fw-bold mt-2">JavaScript</h6>
                                </div>
                            </div>
                        </div>

                        <div class="col-6 col-md-4">
                            <div class="card text-center h-100 language-card"
                                 data-lang="Python">
                                <div class="card-body position-relative">

                                    <span class="badge bg-primary position-absolute top-0 end-0 m-2 d-none">
                                        ✓
                                    </span>

                                    <input type="checkbox"
                                           name="languages[]"
                                           value="Python"
                                           class="d-none">

                                    <i class="devicon-python-plain colored fs-1"></i>
                                    <h6 class="fw-bold mt-2">Python</h6>
                                </div>
                            </div>
                        </div>

                        <div class="col-6 col-md-4">
                            <div class="card text-center h-100 language-card"
                                 data-lang="Java">
                                <div class="card-body position-relative">

                                    <span class="badge bg-primary position-absolute top-0 end-0 m-2 d-none">
                                        ✓
                                    </span>

                                    <input type="checkbox"
                                           name="languages[]"
                                           value="Java"
                                           class="d-none">

                                    <i class="devicon-java-plain colored fs-1"></i>
                                    <h6 class="fw-bold mt-2">Java</h6>
                                </div>
                            </div>
                        </div>

                        <div class="col-6 col-md-4">
                            <div class="card text-center h-100 language-card"
                                 data-lang="php">
                                <div class="card-body position-relative">

                                    <span class="badge bg-primary position-absolute top-0 end-0 m-2 d-none">
                                        ✓
                                    </span>

                                    <input type="checkbox"
                                           name="languages[]"
                                           value="php"
                                           class="d-none">

                                    <i class="devicon-php-plain colored fs-1"></i>
                                    <h6 class="fw-bold mt-2">php</h6>
                                </div>
                            </div>
                        </div>

                        <div class="col-6 col-md-4">
                            <div class="card text-center h-100 language-card"
                                 data-lang="c++">
                                <div class="card-body position-relative">

                                    <span class="badge bg-primary position-absolute top-0 end-0 m-2 d-none">
                                        ✓
                                    </span>

                                    <input type="checkbox"
                                           name="languages[]"
                                           value="c++"
                                           class="d-none">

                                    <i class="devicon-cplusplus-plain colored fs-1"></i>
                                    <h6 class="fw-bold mt-2">c++</h6>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="d-grid mt-4">
                        <button class="btn btn-primary btn-lg rounded-pill">
                            Start Assessment 🚀
                        </button>
                    </div>

                </form>

            </div>

        </div>
    </div>
</div>

<script>
    const cards = document.querySelectorAll('.language-card');
    const selectedText = document.getElementById('selectedLanguages');

    function updateSelected() {
        const selected = [];
        cards.forEach(card => {
            const checkbox = card.querySelector('input');
            if (checkbox.checked) {
                selected.push(card.dataset.lang);
            }
        });
        selectedText.textContent = selected.length ? selected.join(', ') : 'None';
    }

    cards.forEach(card => {
        card.addEventListener('click', () => {
            const checkbox = card.querySelector('input');
            const badge = card.querySelector('.badge');

            checkbox.checked = !checkbox.checked;

            card.classList.toggle('border-primary');
            card.classList.toggle('bg-light');
            badge.classList.toggle('d-none');

            updateSelected();
        });
    });
</script>

</body>
</html>
