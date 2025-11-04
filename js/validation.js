// Registration form validation

// Get quiz ID from URL parameter
function getQuizIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('quiz');
}

// Load quizzes into select dropdown
async function loadQuizzes() {
    const quizSelect = document.getElementById('quizSelect');
    const preselectedQuizId = getQuizIdFromUrl();
    
    try {
        const response = await fetch('/api/quizzes');
        const quizzes = await response.json();
        
        quizzes.forEach(quiz => {
            const option = document.createElement('option');
            option.value = quiz._id;
            option.textContent = `${quiz.title} - ${formatDate(quiz.date)}`;
            
            if (preselectedQuizId && preselectedQuizId === quiz._id) {
                option.selected = true;
            }
            
            quizSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading quizzes:', error);
        quizSelect.innerHTML = '<option value="">Failed to load quizzes</option>';
    }
}

// Format date helper
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Validation functions
function validateName(name) {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name.trim());
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

function validateMobile(mobile) {
    // Remove all non-digit characters
    const cleanMobile = mobile.replace(/\D/g, '');
    // Check if it's exactly 10 digits
    return cleanMobile.length === 10 && /^\d{10}$/.test(cleanMobile);
}

function validateDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const minAge = new Date();
    minAge.setFullYear(today.getFullYear() - 100);
    
    return date < today && date > minAge;
}

// Show validation error
function showError(inputId, errorMessage) {
    const input = document.getElementById(inputId);
    const errorDiv = document.getElementById(inputId + 'Error');
    
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
    
    if (errorDiv) {
        errorDiv.textContent = errorMessage;
    }
}

// Show validation success
function showSuccess(inputId) {
    const input = document.getElementById(inputId);
    
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
}

// Clear validation
function clearValidation(inputId) {
    const input = document.getElementById(inputId);
    input.classList.remove('is-invalid', 'is-valid');
}

// Real-time validation
function setupRealtimeValidation() {
    // First Name
    document.getElementById('firstName').addEventListener('blur', function() {
        if (this.value.trim() === '') {
            clearValidation('firstName');
        } else if (!validateName(this.value)) {
            showError('firstName', 'Please enter a valid first name (2-50 characters, letters only).');
        } else {
            showSuccess('firstName');
        }
    });
    
    // Last Name
    document.getElementById('lastName').addEventListener('blur', function() {
        if (this.value.trim() === '') {
            clearValidation('lastName');
        } else if (!validateName(this.value)) {
            showError('lastName', 'Please enter a valid last name (2-50 characters, letters only).');
        } else {
            showSuccess('lastName');
        }
    });
    
    // Email
    document.getElementById('email').addEventListener('blur', function() {
        if (this.value.trim() === '') {
            clearValidation('email');
        } else if (!validateEmail(this.value)) {
            showError('email', 'Please enter a valid email address (e.g., user@example.com).');
        } else {
            showSuccess('email');
        }
    });
    
    // Mobile
    document.getElementById('mobile').addEventListener('blur', function() {
        if (this.value.trim() === '') {
            clearValidation('mobile');
        } else if (!validateMobile(this.value)) {
            showError('mobile', 'Please enter a valid 10-digit mobile number.');
        } else {
            showSuccess('mobile');
        }
    });
    
    // Date of Birth
    document.getElementById('dateOfBirth').addEventListener('blur', function() {
        if (this.value === '') {
            clearValidation('dateOfBirth');
        } else if (!validateDate(this.value)) {
            showError('dateOfBirth', 'Please enter a valid date of birth.');
        } else {
            showSuccess('dateOfBirth');
        }
    });
}

// Form submission
document.addEventListener('DOMContentLoaded', function() {
    // Load quizzes
    loadQuizzes();
    
    // Setup real-time validation
    setupRealtimeValidation();
    
    const form = document.getElementById('registrationForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Get form values
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const mobile = document.getElementById('mobile').value;
        const dateOfBirth = document.getElementById('dateOfBirth').value;
        const college = document.getElementById('college').value;
        const course = document.getElementById('course').value;
        const year = document.getElementById('year').value;
        const quizSelect = document.getElementById('quizSelect').value;
        const experience = document.getElementById('experience').value;
        const terms = document.getElementById('terms').checked;
        
        // Validate all fields
        if (!validateName(firstName)) {
            showError('firstName', 'Please enter a valid first name (2-50 characters, letters only).');
            isValid = false;
        } else {
            showSuccess('firstName');
        }
        
        if (!validateName(lastName)) {
            showError('lastName', 'Please enter a valid last name (2-50 characters, letters only).');
            isValid = false;
        } else {
            showSuccess('lastName');
        }
        
        if (!validateEmail(email)) {
            showError('email', 'Please enter a valid email address.');
            isValid = false;
        } else {
            showSuccess('email');
        }
        
        if (!validateMobile(mobile)) {
            showError('mobile', 'Please enter a valid 10-digit mobile number.');
            isValid = false;
        } else {
            showSuccess('mobile');
        }
        
        if (!dateOfBirth) {
            showError('dateOfBirth', 'Please enter your date of birth.');
            isValid = false;
        } else if (!validateDate(dateOfBirth)) {
            showError('dateOfBirth', 'Please enter a valid date of birth.');
            isValid = false;
        } else {
            showSuccess('dateOfBirth');
        }
        
        if (!college.trim()) {
            document.getElementById('college').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('college').classList.remove('is-invalid');
            document.getElementById('college').classList.add('is-valid');
        }
        
        if (!course) {
            document.getElementById('course').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('course').classList.remove('is-invalid');
            document.getElementById('course').classList.add('is-valid');
        }
        
        if (!year) {
            document.getElementById('year').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('year').classList.remove('is-invalid');
            document.getElementById('year').classList.add('is-valid');
        }
        
        if (!quizSelect) {
            document.getElementById('quizSelect').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('quizSelect').classList.remove('is-invalid');
            document.getElementById('quizSelect').classList.add('is-valid');
        }
        
        if (!terms) {
            document.getElementById('terms').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('terms').classList.remove('is-invalid');
            document.getElementById('terms').classList.add('is-valid');
        }
        
        // Show error if validation fails
        if (!isValid) {
            document.getElementById('errorAlert').classList.remove('d-none');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            setTimeout(() => {
                document.getElementById('errorAlert').classList.add('d-none');
            }, 5000);
            
            return false;
        }
        
        // Create registration data object
        const registrationData = {
            firstName,
            lastName,
            email,
            mobile,
            dateOfBirth,
            college,
            course,
            year,
            quizId: quizSelect,
            experience,
            registrationDate: new Date().toISOString()
        };
        
        // Send to backend API
        try {
            const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REGISTER), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // Get quiz name for success message
                const quizResponse = await fetch(`/api/quizzes/${quizSelect}`);
                const quiz = await quizResponse.json();
                const quizName = quiz ? quiz.title : 'the quiz';
                
                // Show success modal
                document.getElementById('successMessage').textContent = 
                    `You have successfully registered for "${quizName}".`;
                
                const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                successModal.show();
                
                // Reset form
                form.reset();
                form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
            } else {
                document.getElementById('errorMessage').textContent = result.error || 'Registration failed. Please try again.';
                document.getElementById('errorAlert').classList.remove('d-none');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (error) {
            console.error('Error submitting registration:', error);
            document.getElementById('errorMessage').textContent = 'An error occurred. Please try again later.';
            document.getElementById('errorAlert').classList.remove('d-none');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    });
    
    // Reset button
    form.addEventListener('reset', function() {
        form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });
        document.getElementById('errorAlert').classList.add('d-none');
    });
});
