const scoreElement = document.getElementById("score");
const resultMessage = document.getElementById("resultMessage");
const resumeSection = document.getElementById("resumeSection");

const questions = JSON.parse(
    sessionStorage.getItem("questions")
);

const userAnswers = JSON.parse(
    sessionStorage.getItem("userAnswers")
);


// Check if test data exists
if (!questions || !userAnswers) {

    scoreElement.textContent =
        "No assessment data found.";

    resultMessage.textContent =
        "Please take the assessment first.";

} else {

    calculateResult();

}


// Calculate score
function calculateResult() {

    let score = 0;

    questions.forEach((question, index) => {

        if (
            userAnswers[index] ===
            question.correctAnswer
        ) {

            score++;

        }

    });

    const totalQuestions = questions.length;

    const percentage =
        Math.round((score / totalQuestions) * 100);

    scoreElement.textContent =
        `Your Score: ${score}/${totalQuestions} (${percentage}%)`;


    // Passing threshold = 60%
    if (percentage >= 60) {

        resultMessage.textContent =
            "Congratulations! You have qualified for the next step.";

        showResumeUpload();

    } else {

        resultMessage.textContent =
            "Thank you for completing the assessment. Please try again later.";

    }

}


// Display resume upload section
function showResumeUpload() {

    resumeSection.innerHTML = `

        <div class="resume-box">

            <h3>Upload Your Resume</h3>

            <p>
                Accepted formats: PDF, DOC, DOCX
                <br>
                Maximum size: 5 MB
            </p>

            <form id="resumeForm">

                <input
                    type="file"
                    id="resume"
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    required
                >

                <button type="submit">
                    Upload Resume
                </button>

            </form>

            <p id="uploadMessage"></p>

        </div>

    `;

    const resumeForm =
        document.getElementById("resumeForm");

    resumeForm.addEventListener(
        "submit",
        uploadResume
    );

}


// Upload resume
async function uploadResume(event) {

    event.preventDefault();

    const fileInput =
        document.getElementById("resume");

    const uploadMessage =
        document.getElementById("uploadMessage");

    const file = fileInput.files[0];

    if (!file) {

        uploadMessage.textContent =
            "Please select a resume.";

        return;
    }


    // Check file size
    if (file.size > 5 * 1024 * 1024) {

        uploadMessage.textContent =
            "File size must be less than 5 MB.";

        return;
    }


    // Check file type
    const allowedExtensions = [
        "pdf",
        "doc",
        "docx"
    ];

    const extension =
        file.name
            .split(".")
            .pop()
            .toLowerCase();

    if (!allowedExtensions.includes(extension)) {

        uploadMessage.textContent =
            "Only PDF, DOC and DOCX files are allowed.";

        return;
    }


    const formData = new FormData();

    formData.append("resume", file);


    try {

        uploadMessage.textContent =
            "Uploading...";


        const response = await fetch(
            "/api/upload-resume",
            {
                method: "POST",
                body: formData
            }
        );


        const result =
            await response.json();


        if (result.success) {

            uploadMessage.textContent =
                "Resume uploaded successfully!";

        } else {

            uploadMessage.textContent =
                result.message;

        }


    } catch (error) {

        console.error(error);

        uploadMessage.textContent =
            "Something went wrong. Please try again.";

    }

}


// Retake test
function retakeTest() {

    sessionStorage.clear();

    window.location.href =
        "index.html";

}