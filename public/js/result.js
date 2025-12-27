// Result Page

let testResults = null;

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    await loadResults();
    setupEventHandlers();
});

// Load test results
async function loadResults() {
    const loadingState = document.getElementById('loadingState');
    const resultContainer = document.getElementById('resultContainer');

    try {
        // First, check test status
        let status;
        try {
            status = await API.getTestStatus();
        } catch (statusError) {
            console.error('Error getting test status:', statusError);
            // If we can't get status, likely no session
            showNoSessionError(loadingState, resultContainer);
            return;
        }

        // Check if there's an active test
        if (!status.hasTest) {
            alert('No test found. Please take the test first.');
            navigateTo('index.html');
            return;
        }

        // If test is not submitted yet, redirect to assessment
        if (!status.isSubmitted) {
            alert('Test not yet submitted. Please complete the test first.');
            navigateTo('assessment.html');
            return;
        }

        // Try to get results
        let results;
        try {
            results = await API.getResults();
            testResults = results;
        } catch (getResultsError) {
            console.error('Error getting results:', getResultsError);
            // If get-results fails but test is submitted, try submitting again
            // This handles the case where the score wasn't calculated properly
            try {
                results = await API.submitTest();
                testResults = results;
            } catch (submitError) {
                console.error('Error submitting test:', submitError);
                throw new Error('Unable to retrieve test results. Please try taking the test again.');
            }
        }

        // Validate results structure
        if (!results || typeof results.score === 'undefined') {
            throw new Error('Invalid results data received');
        }
        
        if (loadingState) loadingState.style.display = 'none';
        if (resultContainer) resultContainer.style.display = 'block';

        displayResults(results);
        
        // Check if resume was already uploaded and show download button
        checkForUploadedResume();
    } catch (error) {
        console.error('Error loading results:', error);
        console.error('Error details:', error.message);
        
        // More detailed error message
        const errorMsg = error.message || 'Unknown error occurred';
        
        if (loadingState) loadingState.style.display = 'none';
        if (resultContainer) {
            resultContainer.style.display = 'block';
            resultContainer.innerHTML = `
                <div class="card">
                    <div class="error-message">
                        <h3>Error Loading Results</h3>
                        <p>${errorMsg}</p>
                        <p><small>If this problem persists, please try taking the test again.</small></p>
                        <div style="margin-top: 20px;">
                            <button class="btn btn-primary" onclick="window.location.href='index.html'">Go to Home</button>
                            <button class="btn btn-secondary" onclick="location.reload()" style="margin-left: 10px;">Retry</button>
                        </div>
                    </div>
                </div>
            `;
        }
    }
}

// Show error when no session exists
function showNoSessionError(loadingState, resultContainer) {
    if (loadingState) loadingState.style.display = 'none';
    if (resultContainer) {
        resultContainer.style.display = 'block';
        resultContainer.innerHTML = `
            <div class="card">
                <div class="error-message">
                    <h3>Session Expired</h3>
                    <p>Your test session has expired or was not found. Please start a new test.</p>
                    <div style="margin-top: 20px;">
                        <button class="btn btn-primary" onclick="window.location.href='index.html'">Start New Test</button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Display results
function displayResults(results) {
    displayScore(results);
    displayPassFailMessage(results);
    displayReviewSection(results);
    
    // Show resume upload if passed
    if (results.passed) {
        showResumeUpload();
    }
}

// Display score
function displayScore(results) {
    const scorePercentage = document.getElementById('scorePercentage');
    const scorePercent = document.getElementById('scorePercent');
    const correctAnswers = document.getElementById('correctAnswers');
    const totalQuestionsResult = document.getElementById('totalQuestionsResult');
    const scoreCircle = document.getElementById('scoreCircle');

    if (scorePercentage) scorePercentage.textContent = `${results.percentage}%`;
    if (scorePercent) scorePercent.textContent = `${results.percentage}%`;
    if (correctAnswers) correctAnswers.textContent = results.score;
    if (totalQuestionsResult) totalQuestionsResult.textContent = results.totalQuestions;

    // Update circle color based on pass/fail
    if (scoreCircle) {
        if (results.passed) {
            scoreCircle.style.background = 'linear-gradient(135deg, var(--success-color), #20c997)';
        } else {
            scoreCircle.style.background = 'linear-gradient(135deg, var(--danger-color), #ff6b6b)';
        }
    }
}

// Display pass/fail message
function displayPassFailMessage(results) {
    const passFailMessage = document.getElementById('passFailMessage');
    if (!passFailMessage) return;

    if (results.passed) {
        passFailMessage.className = 'card message-card success';
        passFailMessage.innerHTML = `
            <h3>🎉 Congratulations!</h3>
            <p>You have passed the technical assessment with a score of ${results.percentage}%.</p>
            <p>Please upload your resume to proceed with the next steps.</p>
        `;
    } else {
        passFailMessage.className = 'card message-card error';
        passFailMessage.innerHTML = `
            <h3>Keep Learning!</h3>
            <p>Your score is ${results.percentage}%. You need at least 60% to pass.</p>
            <p>Try again later after more preparation.</p>
        `;
    }
}

// Display review section
function displayReviewSection(results) {
    const reviewContainer = document.getElementById('reviewContainer');
    if (!reviewContainer || !results.results) return;

    reviewContainer.innerHTML = '';

    results.results.forEach((result, index) => {
        const reviewItem = document.createElement('div');
        reviewItem.className = `review-item ${result.isCorrect ? 'correct' : 'incorrect'}`;

        const correctIcon = result.isCorrect ? '✓' : '✗';
        const correctClass = result.isCorrect ? 'success' : 'error';

        reviewItem.innerHTML = `
            <div class="review-question">
                <strong>Question ${index + 1}:</strong> ${result.question}
            </div>
            <div class="review-answer user">
                <strong>Your Answer:</strong> ${result.userAnswer !== null ? result.userAnswer : 'Not answered'}
            </div>
            ${!result.isCorrect ? `
                <div class="review-answer correct">
                    <strong>Correct Answer:</strong> ${result.correctAnswer}
                </div>
            ` : ''}
        `;

        reviewContainer.appendChild(reviewItem);
    });
}

// Show resume upload section
function showResumeUpload() {
    const resumeUploadSection = document.getElementById('resumeUploadSection');
    if (resumeUploadSection) {
        resumeUploadSection.style.display = 'block';
    }
}

// Setup event handlers
function setupEventHandlers() {
    const resumeUploadForm = document.getElementById('resumeUploadForm');
    const resumeFile = document.getElementById('resumeFile');
    const retakeTestBtn = document.getElementById('retakeTestBtn');
    const homeBtn = document.getElementById('homeBtn');

    if (resumeFile) {
        resumeFile.addEventListener('change', (e) => {
            const fileName = document.getElementById('fileName');
            if (fileName && e.target.files.length > 0) {
                fileName.textContent = `Selected: ${e.target.files[0].name}`;
                hideError('uploadError');
            }
        });
    }

    if (resumeUploadForm) {
        resumeUploadForm.addEventListener('submit', handleResumeUpload);
    }

    if (retakeTestBtn) {
        retakeTestBtn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to start a new test? This will clear your current results.')) {
                try {
                    await API.clearSession();
                    navigateTo('index.html');
                } catch (error) {
                    console.error('Error clearing session:', error);
                    // Navigate anyway
                    navigateTo('index.html');
                }
            }
        });
    }

    if (homeBtn) {
        homeBtn.addEventListener('click', () => {
            navigateTo('index.html');
        });
    }
}

// Handle resume upload
async function handleResumeUpload(e) {
    e.preventDefault();

    const fileInput = document.getElementById('resumeFile');
    const uploadBtn = document.getElementById('uploadBtn');
    const uploadError = document.getElementById('uploadError');
    const uploadSuccess = document.getElementById('uploadSuccess');

    if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        showError('uploadError', 'Please select a file to upload.');
        return;
    }

    const file = fileInput.files[0];

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
        showError('uploadError', 'Invalid file type. Please upload a PDF, DOC, or DOCX file.');
        return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        showError('uploadError', 'File size too large. Maximum size is 5MB.');
        return;
    }

    hideError(uploadError);
    hideError(uploadSuccess);

    // Create FormData
    const formData = new FormData();
    formData.append('resume', file);

    showLoading(uploadBtn);

    try {
        const response = await API.uploadResume(formData);
        
        hideLoading(uploadBtn);
        
        if (uploadSuccess) {
            uploadSuccess.textContent = 'Resume uploaded successfully!';
            uploadSuccess.style.display = 'block';
        }

        // Disable form after successful upload
        if (fileInput) fileInput.disabled = true;
        if (uploadBtn) uploadBtn.disabled = true;
        
        // Show download button
        showDownloadResumeButton(response.filename, response.originalName);
    } catch (error) {
        hideLoading(uploadBtn);
        showError('uploadError', error.message || 'Failed to upload resume. Please try again.');
        console.error('Error uploading resume:', error);
    }
}

// Check if resume was already uploaded (when loading results page)
async function checkForUploadedResume() {
    try {
        // Try to access the download endpoint - if it works, resume exists
        const response = await fetch('/api/download-resume', {
            method: 'HEAD',
            credentials: 'include'
        });
        
        if (response.ok) {
            // Resume exists, show download button
            showDownloadResumeButton();
        }
    } catch (error) {
        // Resume not uploaded yet, don't show button
        console.log('No resume uploaded yet');
    }
}

// Show download resume button after successful upload
function showDownloadResumeButton(filename, originalName) {
    const resumeUploadSection = document.getElementById('resumeUploadSection');
    if (!resumeUploadSection) return;
    
    // Check if download button already exists
    let downloadBtn = document.getElementById('downloadResumeBtn');
    if (!downloadBtn) {
        // Create download button container
        const downloadContainer = document.createElement('div');
        downloadContainer.id = 'downloadResumeContainer';
        downloadContainer.style.marginTop = '20px';
        downloadContainer.style.paddingTop = '20px';
        downloadContainer.style.borderTop = '2px solid var(--border-color)';
        
        // Create download button
        downloadBtn = document.createElement('button');
        downloadBtn.id = 'downloadResumeBtn';
        downloadBtn.className = 'btn btn-success';
        downloadBtn.innerHTML = '📥 View/Download Resume';
        downloadBtn.onclick = () => {
            const url = '/api/download-resume' + (originalName || filename ? '?originalName=' + encodeURIComponent(originalName || filename) : '');
            window.open(url, '_blank');
        };
        
        downloadContainer.appendChild(downloadBtn);
        
        // Insert in resume upload section
        resumeUploadSection.appendChild(downloadContainer);
    } else {
        // Update onclick if filename provided
        if (originalName || filename) {
            downloadBtn.onclick = () => {
                const url = '/api/download-resume?originalName=' + encodeURIComponent(originalName || filename);
                window.open(url, '_blank');
            };
        }
    }
    
    downloadBtn.style.display = 'block';
}
