const languageForm = document.getElementById("languageForm");
const errorMessage = document.getElementById("errorMessage");

languageForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const selectedLanguages = document.querySelectorAll(
        'input[name="language"]:checked'
    );

    if (selectedLanguages.length === 0) {
        errorMessage.textContent =
            "Please select at least one programming language.";

        return;
    }

    const languages = Array.from(selectedLanguages).map(
        (checkbox) => checkbox.value
    );

    // Save selected languages for the assessment page
    sessionStorage.setItem(
        "selectedLanguages",
        JSON.stringify(languages)
    );

    // Move to assessment page
    window.location.href = "assessment.html";
});