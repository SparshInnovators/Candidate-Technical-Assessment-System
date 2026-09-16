let allQuestions = [];
let currentQuestion = 0;
let userAnswers = [];

// Get selected languages
const selectedLanguages = JSON.parse(
    sessionStorage.getItem("selectedLanguages")
);

// If no language was selected, go back
if (!selectedLanguages || selectedLanguages.length === 0) {
    window.location.href = "index.html";
}

// Get elements
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const progressElement = document.getElementById("progress");

const previousBtn = document.getElementById("previousBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");


// Load questions from backend
async function loadQuestions() {

    try {

        const response = await fetch("/api/questions");

        if (!response.ok) {
            throw new Error("Unable to load questions");
        }

        const questionData = await response.json();

        // Get questions for selected languages
        selectedLanguages.forEach((language) => {

            if (questionData[language]) {

                allQuestions.push(
                    ...questionData[language]
                );

            }

        });

        if (allQuestions.length === 0) {

            questionElement.textContent =
                "No questions available for the selected languages.";

            return;
        }

        // Create answer array
        userAnswers = new Array(allQuestions.length).fill(null);

        showQuestion();

    } catch (error) {

        console.error(error);

        questionElement.textContent =
            "Unable to load questions. Please try again.";

    }
}


// Display current question
function showQuestion() {

    const current = allQuestions[currentQuestion];

    questionElement.textContent = current.question;

    progressElement.textContent =
        `Question ${currentQuestion + 1} of ${allQuestions.length}`;

    optionsElement.innerHTML = "";

    current.options.forEach((option, index) => {

        const label = document.createElement("label");

        label.className = "option";

        label.innerHTML = `
            <input
                type="radio"
                name="answer"
                value="${index}"
            >
            <span>${option}</span>
        `;

        optionsElement.appendChild(label);

    });

    // Restore previously selected answer
    if (userAnswers[currentQuestion] !== null) {

        const selectedOption =
            document.querySelector(
                `input[value="${userAnswers[currentQuestion]}"]`
            );

        if (selectedOption) {
            selectedOption.checked = true;
        }

    }

    previousBtn.disabled =
        currentQuestion === 0;

    // Show/hide buttons
    if (currentQuestion === allQuestions.length - 1) {

        nextBtn.style.display = "none";
        submitBtn.style.display = "block";

    } else {

        nextBtn.style.display = "block";
        submitBtn.style.display = "none";

    }
}


// Save selected answer
function saveAnswer() {

    const selected =
        document.querySelector(
            'input[name="answer"]:checked'
        );

    if (selected) {

        userAnswers[currentQuestion] =
            Number(selected.value);

    }
}


// Next question
nextBtn.addEventListener("click", function () {

    saveAnswer();

    if (currentQuestion < allQuestions.length - 1) {

        currentQuestion++;

        showQuestion();

    }

});


// Previous question
previousBtn.addEventListener("click", function () {

    saveAnswer();

    if (currentQuestion > 0) {

        currentQuestion--;

        showQuestion();

    }

});


// Submit test
submitBtn.addEventListener("click", function () {

    saveAnswer();

    sessionStorage.setItem(
        "userAnswers",
        JSON.stringify(userAnswers)
    );

    sessionStorage.setItem(
        "questions",
        JSON.stringify(allQuestions)
    );

    window.location.href = "result.html";

});


// Start loading questions
loadQuestions();