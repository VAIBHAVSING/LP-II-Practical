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
function loadDashboardData() {
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const registrations = JSON.parse(localStorage.getItem('registrations')) || [];
    
    // Update statistics
    document.getElementById('totalQuizzes').textContent = quizzes.length;
    document.getElementById('totalRegistrations').textContent = registrations.length;
    document.getElementById('activeQuizzes').textContent = quizzes.filter(q => {
        return new Date(q.date) >= new Date();
    }).length;
    
    // Load recent registrations
    loadRecentRegistrations();
}

// Load recent registrations for overview
function loadRecentRegistrations() {
    const registrations = JSON.parse(localStorage.getItem('registrations')) || [];
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const tbody = document.querySelector('#recentRegistrationsTable tbody');
    
    // Get last 5 registrations
    const recent = registrations.slice(-5).reverse();
    
    if (recent.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center">No recent registrations</td></tr>';
        return;
    }
    
    tbody.innerHTML = '';
    recent.forEach(reg => {
        const quiz = quizzes.find(q => q.id === parseInt(reg.quizId));
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
}

// Load all quizzes
function loadQuizzes() {
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const tbody = document.getElementById('quizzesTableBody');
    
    tbody.innerHTML = '';
    
    if (quizzes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No quizzes available</td></tr>';
        return;
    }
    
    quizzes.forEach(quiz => {
        const row = `
            <tr>
                <td>${quiz.id}</td>
                <td>${quiz.title}</td>
                <td><span class="badge bg-primary">${quiz.category}</span></td>
                <td><span class="badge bg-${getDifficultyColor(quiz.difficulty)}">${quiz.difficulty}</span></td>
                <td>${quiz.date}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editQuiz(${quiz.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteQuiz(${quiz.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
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
document.getElementById('saveQuizBtn').addEventListener('click', function() {
    const title = document.getElementById('quizTitle').value;
    const category = document.getElementById('quizCategory').value;
    const difficulty = document.getElementById('quizDifficulty').value;
    const date = document.getElementById('quizDate').value;
    const description = document.getElementById('quizDescription').value;
    
    if (!title || !category || !difficulty || !date) {
        alert('Please fill in all required fields');
        return;
    }
    
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const newQuiz = {
        id: quizzes.length > 0 ? Math.max(...quizzes.map(q => q.id)) + 1 : 1,
        title,
        category,
        difficulty,
        date,
        description: description || 'No description provided',
        duration: '45 mins',
        questions: 25
    };
    
    quizzes.push(newQuiz);
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('addQuizModal'));
    modal.hide();
    
    // Reset form
    document.getElementById('addQuizForm').reset();
    
    // Reload quizzes
    loadQuizzes();
    loadDashboardData();
    
    alert('Quiz added successfully!');
});

// Edit quiz
function editQuiz(id) {
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const quiz = quizzes.find(q => q.id === id);
    
    if (!quiz) {
        alert('Quiz not found');
        return;
    }
    
    // Populate edit form
    document.getElementById('editQuizId').value = quiz.id;
    document.getElementById('editQuizTitle').value = quiz.title;
    document.getElementById('editQuizCategory').value = quiz.category;
    document.getElementById('editQuizDifficulty').value = quiz.difficulty;
    document.getElementById('editQuizDate').value = quiz.date;
    document.getElementById('editQuizDescription').value = quiz.description;
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editQuizModal'));
    modal.show();
}

// Update quiz
document.getElementById('updateQuizBtn').addEventListener('click', function() {
    const id = parseInt(document.getElementById('editQuizId').value);
    const title = document.getElementById('editQuizTitle').value;
    const category = document.getElementById('editQuizCategory').value;
    const difficulty = document.getElementById('editQuizDifficulty').value;
    const date = document.getElementById('editQuizDate').value;
    const description = document.getElementById('editQuizDescription').value;
    
    if (!title || !category || !difficulty || !date) {
        alert('Please fill in all required fields');
        return;
    }
    
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const index = quizzes.findIndex(q => q.id === id);
    
    if (index === -1) {
        alert('Quiz not found');
        return;
    }
    
    quizzes[index] = {
        ...quizzes[index],
        title,
        category,
        difficulty,
        date,
        description
    };
    
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editQuizModal'));
    modal.hide();
    
    // Reload quizzes
    loadQuizzes();
    loadDashboardData();
    
    alert('Quiz updated successfully!');
});

// Delete quiz
function deleteQuiz(id) {
    if (!confirm('Are you sure you want to delete this quiz?')) {
        return;
    }
    
    let quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    quizzes = quizzes.filter(q => q.id !== id);
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
    
    loadQuizzes();
    loadDashboardData();
    
    alert('Quiz deleted successfully!');
}

// Load all registrations
function loadRegistrations() {
    const registrations = JSON.parse(localStorage.getItem('registrations')) || [];
    const quizzes = JSON.parse(localStorage.getItem('quizzes')) || [];
    const tbody = document.getElementById('registrationsTableBody');
    const filterSelect = document.getElementById('filterByQuiz');
    
    // Populate filter dropdown
    filterSelect.innerHTML = '<option value="">All Quizzes</option>';
    quizzes.forEach(quiz => {
        const option = document.createElement('option');
        option.value = quiz.id;
        option.textContent = quiz.title;
        filterSelect.appendChild(option);
    });
    
    // Display registrations
    displayRegistrations(registrations, quizzes);
    
    // Filter functionality
    filterSelect.addEventListener('change', function() {
        const filtered = this.value ? 
            registrations.filter(r => parseInt(r.quizId) === parseInt(this.value)) : 
            registrations;
        displayRegistrations(filtered, quizzes);
    });
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
        const quiz = quizzes.find(q => q.id === parseInt(reg.quizId));
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${reg.firstName} ${reg.lastName}</td>
                <td>${reg.email}</td>
                <td>${reg.mobile}</td>
                <td>${quiz ? quiz.title : 'N/A'}</td>
                <td>${reg.college}</td>
                <td>${new Date(reg.registrationDate).toLocaleDateString()}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}
