// Language Selection Page

let availableLanguages = [];

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    await loadLanguages();
    await checkExistingSession();
    setupFormHandlers();
});

// Load available languages from API
async function loadLanguages() {
    try {
        const response = await API.getLanguages();
        availableLanguages = response.languages || [];
        renderLanguageList();
    } catch (error) {
        showError('errorMessage', 'Failed to load languages. Please refresh the page.');
        console.error('Error loading languages:', error);
    }
}

// Render language selection list
function renderLanguageList() {
    const languageList = document.getElementById('languageList');
    if (!languageList) return;

    languageList.innerHTML = '';

    if (availableLanguages.length === 0) {
        languageList.innerHTML = '<p>No languages available at the moment.</p>';
        return;
    }

    availableLanguages.forEach(language => {
        const item = document.createElement('div');
        item.className = 'language-item';
        item.innerHTML = `
            <input type="checkbox" id="lang-${language}" name="languages" value="${language}">
            <label for="lang-${language}">${language}</label>
        `;

        // Add click handler for the entire item
        item.addEventListener('click', (e) => {
            if (e.target.type !== 'checkbox') {
                const checkbox = item.querySelector('input[type="checkbox"]');
                checkbox.checked = !checkbox.checked;
                updateItemSelection(item, checkbox.checked);
            } else {
                updateItemSelection(item, e.target.checked);
            }
        });

        // Add change handler for checkbox
        const checkbox = item.querySelector('input[type="checkbox"]');
        checkbox.addEventListener('change', (e) => {
            updateItemSelection(item, e.target.checked);
        });

        languageList.appendChild(item);
    });
}

// Update visual selection state
function updateItemSelection(item, isSelected) {
    if (isSelected) {
        item.classList.add('selected');
    } else {
        item.classList.remove('selected');
    }
}

// Check for existing test session
async function checkExistingSession() {
    try {
        const status = await API.getTestStatus();
        if (status.hasTest && !status.isSubmitted) {
            // There's an active test that hasn't been submitted
            const resume = confirm(
                'You have an active test session. Would you like to continue with the existing test?\n\n' +
                'Click OK to continue, or Cancel to start a new test.'
            );
            
            if (resume) {
                // Continue existing test
                navigateTo('assessment.html');
            } else {
                // Clear session and start fresh
                try {
                    await API.clearSession();
                } catch (error) {
                    console.error('Error clearing session:', error);
                }
            }
        }
    } catch (error) {
        // No active session or error checking - that's fine, continue
        console.log('No existing session or error checking status:', error);
    }
}

// Setup form handlers
function setupFormHandlers() {
    const form = document.getElementById('languageForm');
    const startBtn = document.getElementById('startTestBtn');
    const startTestModal = document.getElementById('startTestModal');
    const confirmStartBtn = document.getElementById('confirmStartBtn');
    const cancelStartBtn = document.getElementById('cancelStartBtn');

    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // Setup modal handlers
    if (confirmStartBtn) {
        confirmStartBtn.addEventListener('click', handleConfirmStartTest);
    }

    if (cancelStartBtn) {
        cancelStartBtn.addEventListener('click', () => {
            if (startTestModal) startTestModal.style.display = 'none';
        });
    }

    // Close modal on background click
    if (startTestModal) {
        startTestModal.addEventListener('click', (e) => {
            if (e.target === startTestModal) {
                startTestModal.style.display = 'none';
            }
        });
    }
}

// Handle form submission - show confirmation modal
async function handleFormSubmit(e) {
    e.preventDefault();

    const errorMessage = document.getElementById('errorMessage');
    hideError(errorMessage);

    // Get selected languages
    const checkboxes = document.querySelectorAll('input[name="languages"]:checked');
    const selectedLanguages = Array.from(checkboxes).map(cb => cb.value);

    // Validate selection
    if (selectedLanguages.length === 0) {
        showError('errorMessage', 'Please select at least one programming language.');
        // Scroll to error message
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
    }

    // Validate maximum languages (optional - can remove if you want unlimited)
    if (selectedLanguages.length > 4) {
        showError('errorMessage', 'Please select a maximum of 4 languages for better test experience.');
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        return;
    }

    // Show confirmation modal
    showStartTestModal(selectedLanguages);
}

// Show confirmation modal with test details
function showStartTestModal(selectedLanguages) {
    const startTestModal = document.getElementById('startTestModal');
    const modalLanguages = document.getElementById('modalLanguages');
    
    if (modalLanguages) {
        modalLanguages.textContent = selectedLanguages.join(', ');
    }
    
    if (startTestModal) {
        startTestModal.style.display = 'flex';
        // Store selected languages for later use
        startTestModal.dataset.languages = JSON.stringify(selectedLanguages);
    }
}

// Handle confirmed test start
async function handleConfirmStartTest() {
    const startTestModal = document.getElementById('startTestModal');
    const startBtn = document.getElementById('startTestBtn');
    
    // Get selected languages from modal data
    let selectedLanguages = [];
    if (startTestModal && startTestModal.dataset.languages) {
        selectedLanguages = JSON.parse(startTestModal.dataset.languages);
    } else {
        // Fallback: get from checkboxes
        const checkboxes = document.querySelectorAll('input[name="languages"]:checked');
        selectedLanguages = Array.from(checkboxes).map(cb => cb.value);
    }

    // Validate again (just in case)
    if (selectedLanguages.length === 0) {
        if (startTestModal) startTestModal.style.display = 'none';
        showError('errorMessage', 'Please select at least one programming language.');
        return;
    }

    // Close modal
    if (startTestModal) startTestModal.style.display = 'none';

    // Show loading on button
    showLoading(startBtn);

    const errorMessage = document.getElementById('errorMessage');
    hideError(errorMessage);

    try {
        // Clear any existing session first
        try {
            await API.clearSession();
        } catch (clearError) {
            // Ignore errors when clearing - might not have a session
            console.log('No existing session to clear');
        }

        // Start test with selected languages
        const response = await API.startTest(selectedLanguages);
        
        if (response.questions && response.questions.length > 0) {
            // Store questions in sessionStorage for frontend access
            sessionStorage.setItem('testQuestions', JSON.stringify(response.questions));
            sessionStorage.setItem('selectedLanguages', JSON.stringify(selectedLanguages));
            
            // Navigate to assessment page
            navigateTo('assessment.html');
        } else {
            showError('errorMessage', 'No questions available for the selected languages. Please try selecting different languages.');
            hideLoading(startBtn);
            errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    } catch (error) {
        showError('errorMessage', error.message || 'Failed to start test. Please try again.');
        hideLoading(startBtn);
        console.error('Error starting test:', error);
        errorMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}
