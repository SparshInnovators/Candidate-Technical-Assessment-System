document.addEventListener('DOMContentLoaded', () => {
    // --- STATE ---
    let currentQuestions = [];
    let userAnswers = {};
    let currentQuestionIndex = 0;
    const availableLanguages = ["JavaScript", "Python", "HTML", "CSS"];
    const API_BASE_URL = 'http://localhost:3000/api';

    // --- DOM ELEMENTS ---
    const pages = {
        selection: document.getElementById('language-selection-page'),
        assessment: document.getElementById('assessment-page'),
        result: document.getElementById('result-page'),
    };
    const languageOptionsContainer = document.getElementById('language-options');
    const startTestBtn = document.getElementById('start-test-btn');
    const selectionError = document.getElementById('selection-error');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const submitBtn = document.getElementById('submit-btn');
    const progressBar = document.getElementById('progress-bar');
    const finalScore = document.getElementById('final-score');
    const resultMessage = document.getElementById('result-message');
    const resumeUploadSection = document.getElementById('resume-upload-section');
    const resumeFile = document.getElementById('resume-file');
    const uploadResumeBtn = document.getElementById('upload-resume-btn');
    const uploadStatus = document.getElementById('upload-status');

    // --- FUNCTIONS ---
    
    function showPage(pageKey) {
        Object.values(pages).forEach(page => page.classList.add('hidden'));
        pages[pageKey].classList.remove('hidden');
    }

    function populateLanguages() {
        languageOptionsContainer.innerHTML = '';
        availableLanguages.forEach(lang => {
            const id = `lang-${lang}`;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = id;
            checkbox.value = lang;
            const label = document.createElement('label');
            label.htmlFor = id;
            label.textContent = lang;
            label.classList.add('language-label');
            languageOptionsContainer.appendChild(checkbox);
            languageOptionsContainer.appendChild(label);
        });
    }

    function displayQuestion() {
        if (currentQuestionIndex >= currentQuestions.length) return;
        const question = currentQuestions[currentQuestionIndex];
        questionText.textContent = question.question;
        optionsContainer.innerHTML = '';
        question.options.forEach(optionText => {
            const optionEl = document.createElement('div');
            optionEl.classList.add('option');
            optionEl.textContent = optionText;
            optionEl.addEventListener('click', () => handleSelectAnswer(optionText));
            if (userAnswers[question.question] === optionText) {
                optionEl.classList.add('selected');
            }
            optionsContainer.appendChild(optionEl);
        });
        updateNavigation();
        updateProgressBar();
    }
    
    function updateProgressBar() {
        const progress = ((currentQuestionIndex + 1) / currentQuestions.length) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function handleSelectAnswer(selectedOption) {
        const question = currentQuestions[currentQuestionIndex].question;
        userAnswers[question] = selectedOption;
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.toggle('selected', opt.textContent === selectedOption);
        });
    }

    function updateNavigation() {
        prevBtn.classList.toggle('hidden', currentQuestionIndex === 0);
        nextBtn.classList.toggle('hidden', currentQuestionIndex === currentQuestions.length - 1);
        submitBtn.classList.toggle('hidden', currentQuestionIndex !== currentQuestions.length - 1);
    }

    async function handleStartTest() {
        const selectedLanguages = Array.from(document.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);
        if (selectedLanguages.length === 0) {
            selectionError.textContent = 'Please select at least one language.';
            selectionError.classList.remove('hidden');
            return;
        }
        selectionError.classList.add('hidden');
        
        try {
            const response = await fetch(`${API_BASE_URL}/questions?languages=${selectedLanguages.join(',')}`);
            if (!response.ok) throw new Error('Failed to load questions.');
            currentQuestions = await response.json();
            if (currentQuestions.length === 0) {
                selectionError.textContent = 'No questions available for the selected language(s).';
                selectionError.classList.remove('hidden');
                return;
            }
            currentQuestionIndex = 0;
            userAnswers = {};
            displayQuestion();
            showPage('assessment');
        } catch (error) {
            selectionError.textContent = `Error: ${error.message}`;
            selectionError.classList.remove('hidden');
        }
    }

    async function handleSubmit() {
        const formattedAnswers = Object.entries(userAnswers).map(([question, answer]) => ({ question, answer }));
        try {
            const response = await fetch(`${API_BASE_URL}/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ answers: formattedAnswers })
            });
            const result = await response.json();
            finalScore.textContent = result.score.toFixed(2);
            resultMessage.textContent = result.message;
            resumeUploadSection.classList.toggle('hidden', !result.passed);
            showPage('result');
        } catch (error) {
            console.error('Error submitting test:', error);
        }
    }

    async function handleUploadResume() {
        if (!resumeFile.files[0]) {
            uploadStatus.textContent = 'Please select a file first.';
            uploadStatus.style.color = 'var(--danger-color)';
            return;
        }
        const formData = new FormData();
        formData.append('resume', resumeFile.files[0]);
        uploadStatus.textContent = 'Uploading...';
        uploadStatus.style.color = 'var(--secondary-color)';
        try {
            const response = await fetch(`${API_BASE_URL}/upload-resume`, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Upload failed.');
            uploadStatus.textContent = result.message;
            uploadStatus.style.color = 'var(--success-color)';
            uploadResumeBtn.disabled = true;
        } catch (error) {
            uploadStatus.textContent = `Error: ${error.message}`;
            uploadStatus.style.color = 'var(--danger-color)';
        }
    }

    // --- EVENT LISTENERS ---
    startTestBtn.addEventListener('click', handleStartTest);
    nextBtn.addEventListener('click', () => {
        if (currentQuestionIndex < currentQuestions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        }
    });
    prevBtn.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            displayQuestion();
        }
    });
    submitBtn.addEventListener('click', handleSubmit);
    uploadResumeBtn.addEventListener('click', handleUploadResume);

    // --- INITIALIZATION ---
    populateLanguages();
    showPage('selection');
});