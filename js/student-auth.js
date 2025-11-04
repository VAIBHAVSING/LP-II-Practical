// Student Authentication System

// Password validation
function validatePassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber;
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

// Name validation
function validateName(name) {
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    return nameRegex.test(name.trim());
}

// Mobile validation
function validateMobile(mobile) {
    const cleanMobile = mobile.replace(/\D/g, '');
    return cleanMobile.length === 10 && /^\d{10}$/.test(cleanMobile);
}

// Student Registration
if (document.getElementById('studentRegistrationForm')) {
    const form = document.getElementById('studentRegistrationForm');
    
    // Password toggle
    document.getElementById('togglePassword').addEventListener('click', function() {
        const passwordInput = document.getElementById('password');
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
    
    document.getElementById('toggleConfirmPassword').addEventListener('click', function() {
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const icon = this.querySelector('i');
        
        if (confirmPasswordInput.type === 'password') {
            confirmPasswordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            confirmPasswordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        let isValid = true;
        const errorAlert = document.getElementById('errorAlert');
        const errorMessage = document.getElementById('errorMessage');
        
        // Get form values
        const firstName = document.getElementById('firstName').value.trim();
        const lastName = document.getElementById('lastName').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const mobile = document.getElementById('mobile').value.trim();
        const dob = document.getElementById('dateOfBirth').value;
        const college = document.getElementById('college').value.trim();
        const course = document.getElementById('course').value;
        const year = document.getElementById('year').value;
        const terms = document.getElementById('terms').checked;
        
        // Validate all fields
        if (!validateName(firstName)) {
            document.getElementById('firstName').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('firstName').classList.remove('is-invalid');
            document.getElementById('firstName').classList.add('is-valid');
        }
        
        if (!validateName(lastName)) {
            document.getElementById('lastName').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('lastName').classList.remove('is-invalid');
            document.getElementById('lastName').classList.add('is-valid');
        }
        
        if (!validateEmail(email)) {
            document.getElementById('email').classList.add('is-invalid');
            document.getElementById('emailError').textContent = 'Please enter a valid email address.';
            isValid = false;
        } else {
            document.getElementById('email').classList.remove('is-invalid');
            document.getElementById('email').classList.add('is-valid');
        }
        
        if (!validatePassword(password)) {
            document.getElementById('password').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('password').classList.remove('is-invalid');
            document.getElementById('password').classList.add('is-valid');
        }
        
        if (password !== confirmPassword) {
            document.getElementById('confirmPassword').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('confirmPassword').classList.remove('is-invalid');
            document.getElementById('confirmPassword').classList.add('is-valid');
        }
        
        if (!validateMobile(mobile)) {
            document.getElementById('mobile').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('mobile').classList.remove('is-invalid');
            document.getElementById('mobile').classList.add('is-valid');
        }
        
        if (!dob) {
            document.getElementById('dateOfBirth').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('dateOfBirth').classList.remove('is-invalid');
            document.getElementById('dateOfBirth').classList.add('is-valid');
        }
        
        if (!college) {
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
        
        if (!terms) {
            document.getElementById('terms').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('terms').classList.remove('is-invalid');
        }
        
        if (!isValid) {
            errorMessage.textContent = 'Please fix the errors above.';
            errorAlert.classList.remove('d-none');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        // Check if email already exists
        try {
            const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.STUDENT_CHECK_EMAIL), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (data.exists) {
                document.getElementById('email').classList.add('is-invalid');
                document.getElementById('emailError').textContent = 'This email is already registered.';
                errorMessage.textContent = 'Email already exists. Please use a different email or login.';
                errorAlert.classList.remove('d-none');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
        } catch (error) {
            console.error('Error checking email:', error);
        }
        
        // Create student account
        const studentData = {
            firstName,
            lastName,
            email,
            password,
            mobile,
            dob,
            college,
            course,
            year,
            role: 'student',
            createdAt: new Date().toISOString()
        };
        
        try {
            const response = await fetch('/api/student/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Show success modal with credentials
                document.getElementById('registeredEmail').textContent = email;
                const successModal = new bootstrap.Modal(document.getElementById('successModal'));
                successModal.show();
                
                // Reset form
                form.reset();
                form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
                errorAlert.classList.add('d-none');
            } else {
                errorMessage.textContent = data.error || 'Registration failed. Please try again.';
                errorAlert.classList.remove('d-none');
            }
        } catch (error) {
            console.error('Error:', error);
            errorMessage.textContent = 'An error occurred. Please try again later.';
            errorAlert.classList.remove('d-none');
        }
    });
    
    // Reset button
    form.addEventListener('reset', function() {
        form.querySelectorAll('.is-valid, .is-invalid').forEach(el => {
            el.classList.remove('is-valid', 'is-invalid');
        });
        document.getElementById('errorAlert').classList.add('d-none');
    });
}

// Student Login
if (document.getElementById('studentLoginForm')) {
    const form = document.getElementById('studentLoginForm');
    
    // Password toggle
    document.getElementById('togglePassword').addEventListener('click', function() {
        const passwordInput = document.getElementById('studentPassword');
        const icon = this.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        } else {
            passwordInput.type = 'password';
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    });
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('studentEmail').value.trim();
        const password = document.getElementById('studentPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        const errorAlert = document.getElementById('loginError');
        const errorText = document.getElementById('errorText');
        
        try {
            const response = await fetch('/api/student/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                // Store student session
                const storage = rememberMe ? localStorage : sessionStorage;
                storage.setItem('studentId', data.student.id);
                storage.setItem('studentEmail', data.student.email);
                storage.setItem('studentName', data.student.firstName + ' ' + data.student.lastName);
                storage.setItem('studentLoggedIn', 'true');
                
                // Redirect to student dashboard or quiz page
                window.location.href = 'student-dashboard.html';
            } else {
                errorText.textContent = data.error || 'Invalid email or password!';
                errorAlert.classList.remove('d-none');
                
                setTimeout(() => {
                    errorAlert.classList.add('d-none');
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
            errorText.textContent = 'An error occurred. Please try again later.';
            errorAlert.classList.remove('d-none');
        }
    });
    
    // Check if already logged in
    if (localStorage.getItem('studentLoggedIn') === 'true' || sessionStorage.getItem('studentLoggedIn') === 'true') {
        window.location.href = 'student-dashboard.html';
    }
}
