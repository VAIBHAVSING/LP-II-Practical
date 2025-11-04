// API Configuration with dynamic BASE_URL
// Automatically detects production vs development environment
const getBaseUrl = () => {
    // Check if we're in production (deployed)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        // Use the same origin as the current page (for Render deployment)
        return window.location.origin;
    }
    // Default to localhost for development
    return 'http://localhost:3000';
};

const API_CONFIG = {
    BASE_URL: getBaseUrl(),
    ENDPOINTS: {
        // Admin endpoints
        ADMIN_LOGIN: '/api/admin/login',
        ADMIN_REGISTER: '/api/admin/register',
        ADMIN_CHECK_EMAIL: '/api/admin/check-email',
        
        // Student endpoints
        STUDENT_LOGIN: '/api/student/login',
        STUDENT_REGISTER: '/api/student/register',
        STUDENT_CHECK_EMAIL: '/api/student/check-email',
        STUDENT_PROFILE: '/api/student/profile',
        STUDENT_CHANGE_PASSWORD: '/api/student/change-password',
        
        // Quiz endpoints
        QUIZZES: '/api/quizzes',
        QUIZ_BY_ID: (id) => `/api/quizzes/${id}`,
        
        // Registration endpoints
        REGISTER: '/api/register',
        REGISTRATIONS: '/api/registrations'
    }
};

// Helper function to build full API URL
function getApiUrl(endpoint) {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
}

// Helper function for API calls with error handling
async function apiCall(endpoint, options = {}) {
    try {
        const url = getApiUrl(endpoint);
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }
        
        return { success: true, data, response };
    } catch (error) {
        console.error('API call failed:', error);
        return { success: false, error: error.message };
    }
}
