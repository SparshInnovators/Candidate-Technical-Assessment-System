// Shared utilities and API functions

const API_BASE_URL = '';

// API helper functions
async function apiRequest(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            credentials: 'include' // Important for session cookies
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'An error occurred');
        }

        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// API functions
const API = {
    getLanguages: () => apiRequest('/api/languages'),
    
    startTest: (languages) => apiRequest('/api/start-test', {
        method: 'POST',
        body: JSON.stringify({ languages })
    }),
    
    submitAnswer: (questionId, answer) => apiRequest('/api/submit-answer', {
        method: 'POST',
        body: JSON.stringify({ questionId, answer })
    }),
    
    submitTest: () => apiRequest('/api/submit-test', {
        method: 'POST'
    }),
    
    getTestStatus: () => apiRequest('/api/test-status'),
    
    getQuestions: () => apiRequest('/api/get-questions'),
    
    getResults: () => apiRequest('/api/get-results'),
    
    uploadResume: (formData) => {
        return fetch(`${API_BASE_URL}/api/upload-resume`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        }).then(response => {
            if (!response.ok) {
                return response.json().then(err => { throw new Error(err.error || 'Upload failed'); });
            }
            return response.json();
        });
    },
    
    clearSession: () => apiRequest('/api/clear-session', {
        method: 'POST'
    }),
    
    downloadResume: (originalName) => {
        const url = `/api/download-resume${originalName ? '?originalName=' + encodeURIComponent(originalName) : ''}`;
        window.open(url, '_blank');
    }
};

// Utility functions
function showError(element, message) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

function hideError(element) {
    if (typeof element === 'string') {
        element = document.getElementById(element);
    }
    if (element) {
        element.style.display = 'none';
    }
}

function showLoading(button) {
    if (button) {
        const text = button.querySelector('.btn-text');
        const loader = button.querySelector('.btn-loader');
        if (text) text.style.display = 'none';
        if (loader) loader.style.display = 'inline';
        button.disabled = true;
    }
}

function hideLoading(button) {
    if (button) {
        const text = button.querySelector('.btn-text');
        const loader = button.querySelector('.btn-loader');
        if (text) text.style.display = 'inline';
        if (loader) loader.style.display = 'none';
        button.disabled = false;
    }
}

function navigateTo(page) {
    window.location.href = page;
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
