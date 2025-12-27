// Assessment/Test Page

let questions = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let testStarted = false;

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    await checkTestStatus();
    setupEventHandlers();
});

// Check if there's an active test session
async function checkTestStatus() {
    try {
        const status = await API.getTestStatus();
        
        if (!status.hasTest) {
            // No active test, redirect to home
            alert('No active test found. Please select languages first.');
            navigateTo('index.html');
            return;
        }

        if (status.isSubmitted) {
            // Test already submitted, redirect to results
            navigateTo('result.html');
            return;
        }

        // Load questions (they should be in session, but we'll fetch from API)
        await loadQuestions();
    } catch (error) {
        console.error('Error checking test status:', error);
        alert('Error loading test. Please try again.');
        navigateTo('index.html');
    }
}

// Load questions from sessionStorage or API
async function loadQuestions() {
    const loadingState = document.getElementById('loadingState');
    const questionContainer = document.getElementById('questionContainer');

    try {
        // First, try to get questions from sessionStorage (stored when test started)
        const storedQuestions = sessionStorage.getItem('testQuestions');
        if (storedQuestions) {
            questions = JSON.parse(storedQuestions);
            userAnswers = new Array(questions.length).fill(null);
            
            // Try to load any previously saved answers from sessionStorage
            const savedAnswers = sessionStorage.getItem('userAnswers');
            if (savedAnswers) {
                const parsed = JSON.parse(savedAnswers);
                if (parsed.length === questions.length) {
                    userAnswers = parsed;
                    // Sync saved answers with backend
                    await syncAnswersWithBackend();
                }
            }
            
            initializeTest();
            return;
        }

        // If no stored questions, try to get from backend session
        try {
            const response = await API.getQuestions();
            if (response.questions && response.questions.length > 0) {
                questions = response.questions;
                userAnswers = new Array(questions.length).fill(null);
                
                // Check for saved answers in sessionStorage
                const savedAnswers = sessionStorage.getItem('userAnswers');
                if (savedAnswers) {
                    const parsed = JSON.parse(savedAnswers);
                    if (parsed.length === questions.length) {
                        userAnswers = parsed;
                        // Sync saved answers with backend
                        await syncAnswersWithBackend();
                    }
                }
                
                // Store in sessionStorage for future reference
                sessionStorage.setItem('testQuestions', JSON.stringify(questions));
                
                initializeTest();
                return;
            }
        } catch (apiError) {
            console.log('Could not load questions from API, checking status...');
        }

        // If still no questions, check backend session status
        const status = await API.getTestStatus();
        if (status.hasTest && !status.isSubmitted) {
            // Test exists in backend but questions couldn't be loaded - redirect to start
            sessionStorage.removeItem('testQuestions');
            alert('Please start a new test.');
            navigateTo('index.html');
        } else {
            // No active test
            alert('No test found. Please start a new test.');
            navigateTo('index.html');
        }
    } catch (error) {
        console.error('Error loading questions:', error);
        if (loadingState) loadingState.style.display = 'none';
        if (questionContainer) questionContainer.style.display = 'block';
        showQuestionError();
    }
}

// Initialize test interface
function initializeTest() {
    const loadingState = document.getElementById('loadingState');
    const questionContainer = document.getElementById('questionContainer');

    if (loadingState) loadingState.style.display = 'none';
    if (questionContainer) questionContainer.style.display = 'block';

    testStarted = true;
    displayQuestion(currentQuestionIndex);
    updateProgress();
    updateNavigationButtons();
    updateScoreDisplay();
}

// Display question
function displayQuestion(index) {
    if (index < 0 || index >= questions.length) return;

    currentQuestionIndex = index;
    const question = questions[index];

    // Update question text
    const questionText = document.getElementById('questionText');
    if (questionText) {
        questionText.textContent = question.question;
    }

    // Update language badge
    const questionLanguage = document.getElementById('questionLanguage');
    if (questionLanguage && question.language) {
        questionLanguage.textContent = question.language;
    }

    // Update question number
    const questionNumDisplay = document.getElementById('questionNumDisplay');
    const currentQuestionNum = document.getElementById('currentQuestionNum');
    if (questionNumDisplay) questionNumDisplay.textContent = index + 1;
    if (currentQuestionNum) currentQuestionNum.textContent = index + 1;

    // Update total questions
    const totalQuestions = document.getElementById('totalQuestions');
    const totalQuestionsCounter = document.getElementById('totalQuestionsCounter');
    if (totalQuestions) totalQuestions.textContent = questions.length;
    if (totalQuestionsCounter) totalQuestionsCounter.textContent = questions.length;

    // Render options
    renderOptions(question.options, userAnswers[index]);

    updateNavigationButtons();
    updateProgress();
}

// Render answer options
function renderOptions(options, selectedAnswer) {
    const optionsContainer = document.getElementById('optionsContainer');
    if (!optionsContainer) return;

    optionsContainer.innerHTML = '';

    options.forEach((option, index) => {
        const optionItem = document.createElement('div');
        optionItem.className = 'option-item';
        if (selectedAnswer === option) {
            optionItem.classList.add('selected');
        }

        optionItem.innerHTML = `
            <input type="radio" id="option-${index}" name="answer" value="${option}" ${selectedAnswer === option ? 'checked' : ''}>
            <label for="option-${index}">${option}</label>
        `;

        optionItem.addEventListener('click', (e) => {
            if (e.target.type !== 'radio') {
                const radio = optionItem.querySelector('input[type="radio"]');
                radio.checked = true;
                handleAnswerSelection(option);
            } else {
                handleAnswerSelection(option);
            }
        });

        const radio = optionItem.querySelector('input[type="radio"]');
        radio.addEventListener('change', () => {
            handleAnswerSelection(option);
        });

        optionsContainer.appendChild(optionItem);
    });
}

// Handle answer selection
async function handleAnswerSelection(answer) {
    userAnswers[currentQuestionIndex] = answer;
    
    // Save answers to sessionStorage
    sessionStorage.setItem('userAnswers', JSON.stringify(userAnswers));
    
    // Update visual selection
    const options = document.querySelectorAll('.option-item');
    options.forEach(item => item.classList.remove('selected'));
    const selectedOption = Array.from(options).find(item => 
        item.querySelector('input[type="radio"]').value === answer
    );
    if (selectedOption) selectedOption.classList.add('selected');

    // Save answer to backend
    try {
        await API.submitAnswer(currentQuestionIndex, answer);
    } catch (error) {
        console.error('Error saving answer:', error);
        // Continue anyway - answer is stored locally
    }

    updateScoreDisplay();
}

// Update progress bar
function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    if (progressFill) {
        const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
        progressFill.style.width = `${progress}%`;
    }
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (prevBtn) {
        prevBtn.disabled = currentQuestionIndex === 0;
    }

    if (nextBtn) {
        if (currentQuestionIndex === questions.length - 1) {
            nextBtn.textContent = 'Last Question';
            nextBtn.disabled = true;
        } else {
            nextBtn.textContent = 'Next';
            nextBtn.disabled = false;
        }
    }
}

// Update score display (based on current answers)
function updateScoreDisplay() {
    // Calculate temporary score based on current answers
    // Note: We can't calculate the real score until submission since we don't have correct answers
    const answeredCount = userAnswers.filter(a => a !== null).length;
    const currentScore = document.getElementById('currentScore');
    if (currentScore) {
        // Show answered count as a progress indicator
        // Real score will be calculated on submission
        currentScore.textContent = answeredCount;
    }
}

// Setup event handlers
function setupEventHandlers() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const submitTestBtn = document.getElementById('submitTestBtn');
    const exitTestBtn = document.getElementById('exitTestBtn');
    const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');
    const cancelSubmitBtn = document.getElementById('cancelSubmitBtn');
    const submitModal = document.getElementById('submitModal');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                displayQuestion(currentQuestionIndex);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentQuestionIndex < questions.length - 1) {
                currentQuestionIndex++;
                displayQuestion(currentQuestionIndex);
            }
        });
    }

    if (submitTestBtn) {
        submitTestBtn.addEventListener('click', () => {
            if (submitModal) submitModal.style.display = 'flex';
        });
    }

    if (confirmSubmitBtn) {
        confirmSubmitBtn.addEventListener('click', handleSubmitTest);
    }

    if (cancelSubmitBtn) {
        cancelSubmitBtn.addEventListener('click', () => {
            if (submitModal) submitModal.style.display = 'none';
        });
    }

    if (exitTestBtn) {
        exitTestBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to exit? Your progress will be saved.')) {
                navigateTo('index.html');
            }
        });
    }

    // Close modal on background click
    if (submitModal) {
        submitModal.addEventListener('click', (e) => {
            if (e.target === submitModal) {
                submitModal.style.display = 'none';
            }
        });
    }
}

// Handle test submission
async function handleSubmitTest() {
    const submitModal = document.getElementById('submitModal');
    const confirmSubmitBtn = document.getElementById('confirmSubmitBtn');

    if (submitModal) submitModal.style.display = 'none';

    showLoading(confirmSubmitBtn);

    try {
        // Clear sessionStorage
        sessionStorage.removeItem('testQuestions');
        sessionStorage.removeItem('userAnswers');
        
        const result = await API.submitTest();
        
        // Navigate to result page
        navigateTo('result.html');
    } catch (error) {
        hideLoading(confirmSubmitBtn);
        alert('Error submitting test: ' + (error.message || 'Please try again.'));
        console.error('Error submitting test:', error);
    }
}

// Show error state
function showQuestionError() {
    const questionContainer = document.getElementById('questionContainer');
    if (questionContainer) {
        questionContainer.innerHTML = `
            <div class="error-message">
                <h3>Error Loading Questions</h3>
                <p>There was an error loading the test questions. Please try again.</p>
                <button class="btn btn-primary" onclick="window.location.href='index.html'">Go Back</button>
            </div>
        `;
    }
}

// Sync saved answers with backend
async function syncAnswersWithBackend() {
    for (let i = 0; i < userAnswers.length; i++) {
        if (userAnswers[i] !== null) {
            try {
                await API.submitAnswer(i, userAnswers[i]);
            } catch (error) {
                console.error(`Error syncing answer ${i}:`, error);
                // Continue syncing other answers even if one fails
            }
        }
    }
}

// Handle browser back/forward
window.addEventListener('beforeunload', (e) => {
    if (testStarted) {
        // Save answers before leaving
        sessionStorage.setItem('userAnswers', JSON.stringify(userAnswers));
    }
});
