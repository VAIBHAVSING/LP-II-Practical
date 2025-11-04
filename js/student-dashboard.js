// Student Dashboard Logic

// Check authentication
function checkAuth() {
    const studentLoggedIn = localStorage.getItem('studentLoggedIn') || sessionStorage.getItem('studentLoggedIn');
    
    if (studentLoggedIn !== 'true') {
        window.location.href = 'student-login.html';
        return false;
    }
    return true;
}

// Get student info
function getStudentInfo() {
    const storage = localStorage.getItem('studentLoggedIn') === 'true' ? localStorage : sessionStorage;
    return {
        id: storage.getItem('studentId'),
        email: storage.getItem('studentEmail'),
        name: storage.getItem('studentName')
    };
}

// Load student profile
async function loadProfile() {
    const student = getStudentInfo();
    
    document.getElementById('studentNameNav').textContent = student.name;
    document.getElementById('studentNameHeader').textContent = student.name;
    document.getElementById('profileName').textContent = student.name;
    document.getElementById('profileEmail').textContent = student.email;
    
    try {
        const response = await fetch(`/api/student/profile/${student.id}`);
        if (response.ok) {
            const data = await response.json();
            document.getElementById('profileCollege').textContent = data.college || 'N/A';
            document.getElementById('profileCourse').textContent = data.course || 'N/A';
            document.getElementById('profileYear').textContent = data.year || 'N/A';
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Load quizzes
async function loadQuizzes() {
    try {
        const response = await fetch('/api/quizzes');
        const quizzes = await response.json();
        
        document.getElementById('totalQuizzes').textContent = quizzes.length;
        
        const quizzesList = document.getElementById('quizzesList');
        
        if (quizzes.length === 0) {
            quizzesList.innerHTML = `
                <div class="text-center py-5 text-muted">
                    <i class="fas fa-inbox fa-3x mb-3"></i>
                    <p>No quizzes available at the moment.</p>
                </div>
            `;
            return;
        }
        
        quizzesList.innerHTML = '';
        
        quizzes.forEach(quiz => {
            const quizCard = document.createElement('div');
            quizCard.className = 'card mb-3 border-0 shadow-sm';
            quizCard.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h6 class="card-title mb-1">${quiz.title}</h6>
                            <p class="text-muted small mb-2">${quiz.description || 'No description available'}</p>
                            <div class="d-flex flex-wrap gap-2 mb-2">
                                <span class="badge bg-primary">${quiz.category}</span>
                                <span class="badge bg-${quiz.difficulty === 'Beginner' ? 'success' : quiz.difficulty === 'Intermediate' ? 'warning' : 'danger'}">${quiz.difficulty}</span>
                                <span class="badge bg-secondary"><i class="fas fa-clock"></i> ${quiz.duration} min</span>
                                <span class="badge bg-info"><i class="fas fa-question-circle"></i> ${quiz.totalQuestions} questions</span>
                            </div>
                        </div>
                        <div class="text-end ms-3">
                            <button class="btn btn-sm btn-primary" onclick="registerForQuiz('${quiz._id}', '${quiz.title}')">
                                <i class="fas fa-pen"></i> Register
                            </button>
                        </div>
                    </div>
                </div>
            `;
            quizzesList.appendChild(quizCard);
        });
        
    } catch (error) {
        console.error('Error loading quizzes:', error);
        document.getElementById('quizzesList').innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-circle"></i> Failed to load quizzes. Please try again later.
            </div>
        `;
    }
}

// Register for quiz
async function registerForQuiz(quizId, quizTitle) {
    const student = getStudentInfo();
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                firstName: student.name.split(' ')[0],
                lastName: student.name.split(' ').slice(1).join(' '),
                email: student.email,
                mobile: '0000000000',
                quizId: quizId
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(`Successfully registered for "${quizTitle}"!`);
            loadQuizzes();
        } else {
            alert(data.error || 'Registration failed. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again later.');
    }
}

// Logout
function logout() {
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentEmail');
    localStorage.removeItem('studentName');
    localStorage.removeItem('studentLoggedIn');
    
    sessionStorage.removeItem('studentId');
    sessionStorage.removeItem('studentEmail');
    sessionStorage.removeItem('studentName');
    sessionStorage.removeItem('studentLoggedIn');
    
    window.location.href = 'student-login.html';
}

// Change password
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;
    
    loadProfile();
    loadQuizzes();
    
    // Logout button
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to logout?')) {
            logout();
        }
    });
    
    // View profile button
    document.getElementById('viewProfile').addEventListener('click', function(e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Change password
    document.getElementById('savePasswordBtn').addEventListener('click', async function() {
        const currentPassword = document.getElementById('currentPassword').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmNewPassword = document.getElementById('confirmNewPassword').value;
        
        const errorDiv = document.getElementById('passwordError');
        const successDiv = document.getElementById('passwordSuccess');
        
        errorDiv.classList.add('d-none');
        successDiv.classList.add('d-none');
        
        if (!currentPassword || !newPassword || !confirmNewPassword) {
            errorDiv.textContent = 'All fields are required.';
            errorDiv.classList.remove('d-none');
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            errorDiv.textContent = 'New passwords do not match.';
            errorDiv.classList.remove('d-none');
            return;
        }
        
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            errorDiv.textContent = 'Password must be at least 8 characters with uppercase, lowercase, and number.';
            errorDiv.classList.remove('d-none');
            return;
        }
        
        const student = getStudentInfo();
        
        try {
            const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.STUDENT_CHANGE_PASSWORD), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    studentId: student.id,
                    currentPassword,
                    newPassword
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                successDiv.textContent = 'Password changed successfully!';
                successDiv.classList.remove('d-none');
                document.getElementById('changePasswordForm').reset();
                
                setTimeout(() => {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('changePasswordModal'));
                    modal.hide();
                }, 2000);
            } else {
                errorDiv.textContent = data.error || 'Failed to change password.';
                errorDiv.classList.remove('d-none');
            }
        } catch (error) {
            console.error('Error:', error);
            errorDiv.textContent = 'An error occurred. Please try again.';
            errorDiv.classList.remove('d-none');
        }
    });
});
