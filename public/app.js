
    const $ = (id) => document.getElementById(id);

    let questions = [];
    let answers = {};
    let currentQuestion = 0;
    let timeLeft = 20 * 60;
    let timerInterval = null;
    let assessmentFinished = false;

    const PASS_PERCENTAGE = 70;
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const screens = [
    $("setup-screen"),
    $("assessment-screen"),
    $("result-screen")
    ];

    function showScreen(screenToShow) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
    screens.forEach((screen) => screen.classList.add("hidden"));
    screenToShow.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function showError(id, message) {
    $(id).textContent = message || "";
    }

    async function readResponse(response) {
    const data = await response.json();

    if (!response.ok || data.success === false) {
        throw new Error(
        data.message || "Something went wrong. Please try again."
        );
    }

    return data;
    }

    // Load available programming languages.
    async function loadLanguages() {
    const languageList = $("language-list");

    try {
        const response = await fetch("/api/languages");
        const data = await readResponse(response);

        languageList.innerHTML = "";

        if (!data.languages || data.languages.length === 0) {
        languageList.textContent =
            "No languages are currently available.";
        return;
        }

        data.languages.forEach((language) => {
        const label = document.createElement("label");
        label.className = "language-card";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = language;
        checkbox.name = "languages";

        const name = document.createElement("strong");
        name.textContent = language;

        checkbox.addEventListener("change", () => {
            label.classList.toggle("selected", checkbox.checked);
        });

        label.append(checkbox, name);
        languageList.appendChild(label);
        });
    } catch (error) {
        languageList.textContent =
        "Could not load languages. Please make sure the server is running.";
    }
    }

    // Start a new assessment.
    $("start-btn").addEventListener("click", async () => {
    showError("setup-error", "");

    const selectedLanguages = Array.from(
        document.querySelectorAll(
        'input[name="languages"]:checked'
        )
    ).map((checkbox) => checkbox.value);

    if (selectedLanguages.length === 0) {
        showError(
        "setup-error",
        "Please select at least one programming language."
        );
        return;
    }

    const button = $("start-btn");
    button.disabled = true;
    button.textContent = "Starting...";

    try {
        const response = await fetch("/api/start", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            languages: selectedLanguages
        })
        });

        const data = await readResponse(response);

        if (!Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error("No assessment questions are available.");
        }

        questions = data.questions;
        answers = {};
        currentQuestion = 0;
        assessmentFinished = false;
        timeLeft = 20 * 60;

        showScreen($("assessment-screen"));
        renderQuestion();
        startTimer();
    } catch (error) {
        showError("setup-error", error.message);
    } finally {
        button.disabled = false;
        button.textContent = "Start Assessment →";
    }
    });

    // Display the current question and options.
    function renderQuestion() {
    if (!questions.length) {
        return;
    }

    const question = questions[currentQuestion];

    $("question-count").textContent =
        `Question ${currentQuestion + 1} of ${questions.length}`;

    const progress = Math.round(
        ((currentQuestion + 1) / questions.length) * 100
    );

    $("progress-percent").textContent =
        `${progress}% through assessment`;

    $("progress-bar").style.width = `${progress}%`;
    $("question-language").textContent = question.language;
    $("question-text").textContent = question.question;

    $("answered-count").textContent =
        `${Object.keys(answers).length} of ${questions.length} answered`;

    const optionsList = $("options-list");
    optionsList.innerHTML = "";

    question.options.forEach((option, index) => {
        const label = document.createElement("label");
        label.className = "option";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "question-answer";
        radio.value = index;
        radio.checked = answers[question.id] === index;

        const optionText = document.createElement("span");
        optionText.textContent =
        `${String.fromCharCode(65 + index)}. ${option}`;

        if (radio.checked) {
        label.classList.add("selected");
        }

        radio.addEventListener("change", () => {
        answers[question.id] = index;

        optionsList.querySelectorAll(".option").forEach((item) => {
            item.classList.remove("selected");
        });

        label.classList.add("selected");

        $("answered-count").textContent =
            `${Object.keys(answers).length} of ${questions.length} answered`;
        });

        label.append(radio, optionText);
        optionsList.appendChild(label);
    });

    $("prev-btn").disabled = currentQuestion === 0;

    if (currentQuestion === questions.length - 1) {
        $("next-btn").textContent = "Last Question";
        $("next-btn").disabled = true;
    } else {
        $("next-btn").textContent = "Next →";
        $("next-btn").disabled = false;
    }

    showError("assessment-error", "");
    }

    // Previous question.
    $("prev-btn").addEventListener("click", () => {
    if (currentQuestion > 0) {
        currentQuestion--;
        renderQuestion();
    }
    });

    // Next question.
    $("next-btn").addEventListener("click", () => {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        renderQuestion();
    }
    });

    // Update countdown timer.
    function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    $("timer").textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    }

    // Start countdown.
    function startTimer() {
    clearInterval(timerInterval);
    updateTimer();

    timerInterval = setInterval(() => {
        if (assessmentFinished) {
        clearInterval(timerInterval);
        return;
        }

        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
        clearInterval(timerInterval);
        submitAssessment(true);
        }
    }, 1000);
    }

    // Submit assessment after confirmation.
    $("submit-btn").addEventListener("click", () => {
    const unanswered =
        questions.length - Object.keys(answers).length;

    const message = unanswered > 0
        ? `${unanswered} question(s) are unanswered. Submit anyway?`
        : "Are you sure you want to submit your assessment?";

    if (window.confirm(message)) {
        submitAssessment(false);
    }
    });

    // Send answers to the backend and calculate results.
    async function submitAssessment(timeExpired = false) {
    if (assessmentFinished) {
        return;
    }

    showError("assessment-error", "");

    const submitButton = $("submit-btn");
    submitButton.disabled = true;
    submitButton.textContent = "Submitting...";

    try {
        const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            answers: answers
        })
        });

        const data = await readResponse(response);

        assessmentFinished = true;
        clearInterval(timerInterval);

        renderResults(data, timeExpired);
        showScreen($("result-screen"));
    } catch (error) {
        showError("assessment-error", error.message);
    } finally {
        submitButton.disabled = false;
        submitButton.textContent = "Submit Assessment";
    }
    }

    // Display final score, qualification status and answer review.
    function renderResults(result, timeExpired = false) {
    $("score-percent").textContent = `${result.percentage}%`;

    $("score-correct").textContent =
        `${result.correctAnswers} / ${result.totalQuestions}`;

    $("score-required").textContent =
        `${result.passPercentage}%`;

    const qualified = result.resumeEligible;

    $("qualification-status").textContent = qualified
        ? "Qualified"
        : "Not qualified";

    $("qualification-status").className = qualified
        ? "answer-correct"
        : "answer-wrong";

    // Result page messages for both outcomes.
    if (qualified) {
        $("result-title").textContent = "Congratulations!";

        $("result-message").textContent =
        `Success! You scored ${result.percentage}% and passed the assessment. You can now upload your resume.`;
    } else {
        $("result-title").textContent = "Assessment Complete";

        $("result-message").textContent = timeExpired
        ? `Your time ran out. You scored ${result.percentage}%. Your score is below the required threshold. Try again later.`
        : `You scored ${result.percentage}%. Your score is below the required threshold. Try again later.`;
    }

    // Only qualified candidates can see the resume upload section.
    $("resume-section").classList.toggle(
        "hidden",
        !qualified
    );

    $("upload-message").textContent = "";
    $("upload-message").className = "";
    $("resume-file").value = "";

    // Display answer review.
    const reviewList = $("review-list");
    reviewList.innerHTML = "";

    (result.review || []).forEach((item, index) => {
        const card = document.createElement("article");
        card.className = "review-item";

        const questionHeading = document.createElement("h3");
        questionHeading.textContent =
        `${index + 1}. ${item.question}`;

        const language = document.createElement("p");
        language.className = "muted small";
        language.textContent = item.language;

        const yourAnswer = document.createElement("p");

        const selected = item.selectedIndex === null
        ? "Not answered"
        : item.options[item.selectedIndex];

        yourAnswer.textContent = `Your answer: ${selected}`;
        yourAnswer.className = item.correct
        ? "answer-correct"
        : "answer-wrong";

        const correctAnswer = document.createElement("p");
        correctAnswer.className = "answer-correct";
        correctAnswer.textContent =
        `Correct answer: ${item.options[item.correctIndex]}`;

        card.append(
        questionHeading,
        language,
        yourAnswer,
        correctAnswer
        );

        if (item.explanation) {
        const explanation = document.createElement("p");
        explanation.textContent =
            `Explanation: ${item.explanation}`;

        card.appendChild(explanation);
        }

        reviewList.appendChild(card);
    });
    }

    // Upload resume for candidates who passed.
    $("resume-form").addEventListener("submit", async (event) => {
    event.preventDefault();

    const file = $("resume-file").files[0];

    if (!file) {
        $("upload-message").textContent =
        "Please select a resume first.";
        $("upload-message").className = "answer-wrong";
        return;
    }

    const allowedExtensions = [".pdf", ".doc", ".docx"];

    const extension = file.name
        .slice(file.name.lastIndexOf("."))
        .toLowerCase();

    if (!allowedExtensions.includes(extension)) {
        $("upload-message").textContent =
        "Please select a PDF, DOC or DOCX file.";
        $("upload-message").className = "answer-wrong";
        return;
    }

    if (file.size > MAX_FILE_SIZE) {
        $("upload-message").textContent =
        "Your resume must be 5 MB or smaller.";
        $("upload-message").className = "answer-wrong";
        return;
    }

    const button = $("upload-btn");
    button.disabled = true;
    button.textContent = "Uploading...";

    const formData = new FormData();
    formData.append("resume", file);

    try {
        const response = await fetch("/api/upload-resume", {
        method: "POST",
        body: formData
        });

        const data = await readResponse(response);

        $("upload-message").textContent = data.message;
        $("upload-message").className = "answer-correct";
    } catch (error) {
        $("upload-message").textContent = error.message;
        $("upload-message").className = "answer-wrong";
    } finally {
        button.disabled = false;
        button.textContent = "Upload Resume";
    }
    });

    // Start a fresh assessment.
    $("restart-btn").addEventListener("click", () => {
    clearInterval(timerInterval);

    questions = [];
    answers = {};
    currentQuestion = 0;
    timeLeft = 20 * 60;
    assessmentFinished = false;

    $("timer").textContent = "20:00";

    showError("setup-error", "");
    showError("assessment-error", "");

    showScreen($("setup-screen"));
    });

    // Initialize the language selection screen.
    loadLanguages();

