// Admin Authentication System

// Password validation for admin (stricter)
function validateAdminPassword(password) {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecial;
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

// Admin Registration
if (document.getElementById('adminRegisterForm')) {
    const form = document.getElementById('adminRegisterForm');
    
    // Password toggle
    document.getElementById('togglePassword').addEventListener('click', function() {
        const passwordInput = document.getElementById('adminPassword');
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
        const confirmPasswordInput = document.getElementById('adminConfirmPassword');
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
        const errorAlert = document.getElementById('registerError');
        const errorText = document.getElementById('errorText');
        
        // Get form values
        const name = document.getElementById('adminName').value.trim();
        const email = document.getElementById('adminEmail').value.trim();
        const password = document.getElementById('adminPassword').value;
        const confirmPassword = document.getElementById('adminConfirmPassword').value;
        const department = document.getElementById('department').value;
        const agreeTerms = document.getElementById('agreeTerms').checked;
        
        // Validate all fields
        if (!validateName(name)) {
            document.getElementById('adminName').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('adminName').classList.remove('is-invalid');
            document.getElementById('adminName').classList.add('is-valid');
        }
        
        if (!validateEmail(email)) {
            document.getElementById('adminEmail').classList.add('is-invalid');
            document.getElementById('emailError').textContent = 'Please enter a valid email address.';
            isValid = false;
        } else {
            document.getElementById('adminEmail').classList.remove('is-invalid');
            document.getElementById('adminEmail').classList.add('is-valid');
        }
        
        if (!validateAdminPassword(password)) {
            document.getElementById('adminPassword').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('adminPassword').classList.remove('is-invalid');
            document.getElementById('adminPassword').classList.add('is-valid');
        }
        
        if (password !== confirmPassword) {
            document.getElementById('adminConfirmPassword').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('adminConfirmPassword').classList.remove('is-invalid');
            document.getElementById('adminConfirmPassword').classList.add('is-valid');
        }
        
        if (!agreeTerms) {
            document.getElementById('agreeTerms').classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('agreeTerms').classList.remove('is-invalid');
        }
        
        if (!isValid) {
            errorText.textContent = 'Please fix the errors above.';
            errorAlert.classList.remove('d-none');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        
        // Check if email already exists
        try {
            const checkResponse = await fetch('/api/admin/check-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            
            const checkData = await checkResponse.json();
            
            if (checkData.exists) {
                document.getElementById('adminEmail').classList.add('is-invalid');
                document.getElementById('emailError').textContent = 'This email is already registered.';
                errorText.textContent = 'Email already exists. Please use a different email or login.';
                errorAlert.classList.remove('d-none');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }
        } catch (error) {
            console.error('Error checking email:', error);
        }
        
        // Create admin account request
        const adminData = {
            name,
            email,
            password,
            department,
            role: 'admin',
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        try {
            const response = await fetch('/api/admin/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(adminData)
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
                errorText.textContent = data.error || 'Registration failed. Please try again.';
                errorAlert.classList.remove('d-none');
            }
        } catch (error) {
            console.error('Error:', error);
            errorText.textContent = 'An error occurred. Please try again later.';
            errorAlert.classList.remove('d-none');
        }
    });
}
