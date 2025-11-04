// Admin Dashboard JavaScript

// Check authentication
function checkAuth() {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true' || 
                      sessionStorage.getItem('adminLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return false;
    }
    
    // Display admin email
    const adminEmail = localStorage.getItem('adminEmail') || sessionStorage.getItem('adminEmail');
    document.getElementById('adminEmailDisplay').textContent = adminEmail;
    
    return true;
}

// Logout function
document.getElementById('logoutBtn').addEventListener('click', function() {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminEmail');
    sessionStorage.removeItem('adminLoggedIn');
    sessionStorage.removeItem('adminEmail');
    
    window.location.href = 'login.html';
});

// Navigation between sections
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    if (!checkAuth()) {
        return;
    }
    
    // Load initial data
    loadDashboardData();
    
    // Sidebar navigation
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Hide all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.add('d-none');
            });
            
            // Show selected section
            const sectionName = this.getAttribute('data-section');
            const sectionMap = {
                'overview': 'overviewSection',
                'quizzes': 'quizzesSection',
                'registrations': 'registrationsSection'
            };
            
            document.getElementById(sectionMap[sectionName]).classList.remove('d-none');
            
            // Update title
            const titles = {
                'overview': 'Dashboard Overview',
                'quizzes': 'Manage Quizzes',
                'registrations': 'View Registrations'
            };
            document.getElementById('sectionTitle').textContent = titles[sectionName];
            
            // Load section data
            if (sectionName === 'quizzes') {
                loadQuizzes();
            } else if (sectionName === 'registrations') {
                loadRegistrations();
            }
        });
    });
});

// Load dashboard statistics
async function loadDashboardData() {
    try {
        // Fetch quizzes from backend
        const quizzesResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.QUIZZES));
        const quizzes = await quizzesResponse.json();
        
        // Fetch registrations from backend
        const registrationsResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATIONS));
        const registrations = await registrationsResponse.json();
        
        // Update statistics
        document.getElementById('totalQuizzes').textContent = quizzes.length;
        document.getElementById('totalRegistrations').textContent = registrations.length;
        document.getElementById('activeQuizzes').textContent = quizzes.filter(q => {
            return new Date(q.date) >= new Date();
        }).length;
        
        // Load recent registrations
        loadRecentRegistrations();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showAlert('Failed to load dashboard data', 'danger');
    }
}

// Load recent registrations for overview
async async function loadRecentRegistrations() {
    try {
        const registrationsResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATIONS));
        const registrations = await registrationsResponse.json();
        
        const quizzesResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.QUIZZES));
        const quizzes = await quizzesResponse.json();
        
        const tbody = document.querySelector('#recentRegistrationsTable tbody');
        
        // Get last 5 registrations
        const recent = registrations.slice(-5).reverse();
        
        if (recent.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">No recent registrations</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        recent.forEach(reg => {
            const quiz = quizzes.find(q => q._id === reg.quizId);
            const row = `
                <tr>
                    <td>${reg.firstName} ${reg.lastName}</td>
                    <td>${reg.email}</td>
                    <td>${quiz ? quiz.title : 'N/A'}</td>
                    <td>${new Date(reg.registrationDate).toLocaleDateString()}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading recent registrations:', error);
    }
}

// Load all quizzes
async function loadQuizzes() {
    try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.QUIZZES));
        const quizzes = await response.json();
        
        const tbody = document.getElementById('quizzesTableBody');
        tbody.innerHTML = '';
        
        if (quizzes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No quizzes available</td></tr>';
            return;
        }
        
        quizzes.forEach(quiz => {
            const row = `
                <tr>
                    <td>${quiz._id.substring(0, 8)}...</td>
                    <td>${quiz.title}</td>
                    <td><span class="badge bg-primary">${quiz.category}</span></td>
                    <td><span class="badge bg-${getDifficultyColor(quiz.difficulty)}">${quiz.difficulty}</span></td>
                    <td>${new Date(quiz.date).toLocaleDateString()}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editQuiz('${quiz._id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteQuiz('${quiz._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error loading quizzes:', error);
        showAlert('Failed to load quizzes', 'danger');
    }
}

// Get difficulty badge color
function getDifficultyColor(difficulty) {
    const colors = {
        'Beginner': 'success',
        'Intermediate': 'warning',
        'Advanced': 'danger'
    };
    return colors[difficulty] || 'secondary';
}

// Add new quiz
document.getElementById('saveQuizBtn').addEventListener('click', async function() {
    const title = document.getElementById('quizTitle').value;
    const category = document.getElementById('quizCategory').value;
    const difficulty = document.getElementById('quizDifficulty').value;
    const date = document.getElementById('quizDate').value;
    const description = document.getElementById('quizDescription').value;
    const duration = document.getElementById('quizDuration')?.value || 45;
    const totalQuestions = document.getElementById('quizQuestions')?.value || 25;
    
    if (!title || !category || !difficulty || !date) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }
    
    const newQuiz = {
        title,
        category,
        difficulty,
        date,
        description: description || 'No description provided',
        duration: parseInt(duration),
        totalQuestions: parseInt(totalQuestions),
        passingScore: 70
    };
    
    try {
        const response = await fetch('/api/quizzes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newQuiz)
        });
        
        if (response.ok) {
            const result = await response.json();
            
                    // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addQuizModal'));
            modal.hide();
            
            // Reset form
            document.getElementById('addQuizForm').reset();
            
            // Reload quizzes
            loadQuizzes();
            loadDashboardData();
            
            showAlert('Quiz added successfully!', 'success');
        } else {
            const error = await response.json();
            showAlert(error.error || 'Failed to add quiz', 'danger');
        }
    } catch (error) {
        console.error('Error adding quiz:', error);
        showAlert('An error occurred while adding quiz', 'danger');
    }
});

// Edit quiz
async function editQuiz(id) {
    try {
        const response = await fetch(`/api/quizzes/${id}`);
        const quiz = await response.json();
        
        if (!quiz) {
            showAlert('Quiz not found', 'warning');
            return;
        }
        
        // Populate edit form
        document.getElementById('editQuizId').value = quiz._id;
        document.getElementById('editQuizTitle').value = quiz.title;
        document.getElementById('editQuizCategory').value = quiz.category;
        document.getElementById('editQuizDifficulty').value = quiz.difficulty;
        document.getElementById('editQuizDate').value = quiz.date.split('T')[0];
        document.getElementById('editQuizDescription').value = quiz.description;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editQuizModal'));
        modal.show();
    } catch (error) {
        console.error('Error loading quiz:', error);
        showAlert('Failed to load quiz details', 'danger');
    }
}

// Update quiz
document.getElementById('updateQuizBtn').addEventListener('click', async function() {
    const id = document.getElementById('editQuizId').value;
    const title = document.getElementById('editQuizTitle').value;
    const category = document.getElementById('editQuizCategory').value;
    const difficulty = document.getElementById('editQuizDifficulty').value;
    const date = document.getElementById('editQuizDate').value;
    const description = document.getElementById('editQuizDescription').value;
    
    if (!title || !category || !difficulty || !date) {
        showAlert('Please fill in all required fields', 'warning');
        return;
    }
    
    const updatedQuiz = {
        title,
        category,
        difficulty,
        date,
        description
    };
    
    try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.QUIZ_BY_ID(id)), {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedQuiz)
        });
        
        if (response.ok) {
                    // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editQuizModal'));
            modal.hide();
            
            // Reload quizzes
            loadQuizzes();
            loadDashboardData();
            
            showAlert('Quiz updated successfully!', 'success');
        } else {
            const error = await response.json();
            showAlert(error.error || 'Failed to update quiz', 'danger');
        }
    } catch (error) {
        console.error('Error updating quiz:', error);
        showAlert('An error occurred while updating quiz', 'danger');
    }
});

// Delete quiz
async function deleteQuiz(id) {
    if (!confirm('Are you sure you want to delete this quiz?')) {
        return;
    }
    
    try {
        const response = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.QUIZ_BY_ID(id)), {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadQuizzes();
            loadDashboardData();
            showAlert('Quiz deleted successfully!', 'success');
        } else {
            const error = await response.json();
            showAlert(error.error || 'Failed to delete quiz', 'danger');
        }
    } catch (error) {
        console.error('Error deleting quiz:', error);
        showAlert('An error occurred while deleting quiz', 'danger');
    }
}

// Load all registrations
async function loadRegistrations() {
    try {
        const registrationsResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.REGISTRATIONS));
        const registrations = await registrationsResponse.json();
        
        const quizzesResponse = await fetch(getApiUrl(API_CONFIG.ENDPOINTS.QUIZZES));
        const quizzes = await quizzesResponse.json();
        
        const tbody = document.getElementById('registrationsTableBody');
        const filterSelect = document.getElementById('filterByQuiz');
        
        // Populate filter dropdown
        filterSelect.innerHTML = '<option value="">All Quizzes</option>';
        quizzes.forEach(quiz => {
            const option = document.createElement('option');
            option.value = quiz._id;
            option.textContent = quiz.title;
            filterSelect.appendChild(option);
        });
        
        // Display registrations
        displayRegistrations(registrations, quizzes);
        
        // Filter functionality
        filterSelect.addEventListener('change', function() {
            const filtered = this.value ?
                registrations.filter(r => r.quizId === this.value) : 
                registrations;
            displayRegistrations(filtered, quizzes);
        });
    } catch (error) {
        console.error('Error loading registrations:', error);
        showAlert('Failed to load registrations', 'danger');
    }
}

// Display registrations in table
function displayRegistrations(registrations, quizzes) {
    const tbody = document.getElementById('registrationsTableBody');
    
    if (registrations.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No registrations found</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    registrations.forEach((reg, index) => {
        const quiz = quizzes.find(q => q._id === reg.quizId);
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${reg.firstName} ${reg.lastName}</td>
                <td>${reg.email}</td>
                <td>${reg.mobile}</td>
                <td>${quiz ? quiz.title : 'N/A'}</td>
                <td>${reg.college || 'N/A'}</td>
                <td>${new Date(reg.registrationDate).toLocaleDateString()}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

// Show alert message
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}
