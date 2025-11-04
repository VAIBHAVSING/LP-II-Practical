// Events page - Display and filter quizzes dynamically

// Global quizzes array
let quizzes = [];
let filteredQuizzes = [];

// Load quizzes from backend
async function loadQuizzes() {
    try {
        const response = await fetch('/api/quizzes');
        quizzes = await response.json();
        filteredQuizzes = [...quizzes];
        
        // Display all quizzes initially
        displayQuizzes(quizzes);
        
        // Setup filters after loading
        setupFilters();
    } catch (error) {
        console.error('Error loading quizzes:', error);
        const container = document.getElementById('quizzesContainer');
        if (container) {
            container.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger">
                        <i class="fas fa-exclamation-circle"></i> Failed to load quizzes. Please try again later.
                    </div>
                </div>
            `;
        }
    }
}

// Display quizzes
function displayQuizzes(quizzesToDisplay) {
    const container = document.getElementById('quizzesContainer');
    const noResults = document.getElementById('noResults');
    const quizCount = document.getElementById('quizCount');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (quizzesToDisplay.length === 0) {
        container.classList.add('d-none');
        if (noResults) noResults.classList.remove('d-none');
        if (quizCount) quizCount.textContent = '0';
        return;
    }
    
    container.classList.remove('d-none');
    if (noResults) noResults.classList.add('d-none');
    if (quizCount) quizCount.textContent = quizzesToDisplay.length;
    
    quizzesToDisplay.forEach(quiz => {
        const quizCard = `
            <div class="col-lg-4 col-md-6 mb-4">
                <div class="card quiz-card shadow-sm h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h5 class="card-title">${quiz.title}</h5>
                            <span class="badge bg-primary">${quiz.category}</span>
                        </div>
                        <p class="card-text text-muted">${quiz.description}</p>
                        <div class="mb-3">
                            <span class="difficulty-badge difficulty-${quiz.difficulty}">${quiz.difficulty}</span>
                        </div>
                        <div class="d-flex justify-content-between text-muted mb-3">
                            <small><i class="fas fa-calendar"></i> ${formatDate(quiz.date)}</small>
                            <small><i class="fas fa-clock"></i> ${quiz.duration} mins</small>
                        </div>
                        <div class="d-flex justify-content-between text-muted mb-3">
                            <small><i class="fas fa-question-circle"></i> ${quiz.totalQuestions} Questions</small>
                            <small><i class="fas fa-percentage"></i> Pass: ${quiz.passingScore}%</small>
                        </div>
                        <a href="register.html?quiz=${quiz._id}" class="btn btn-primary w-100">
                            <i class="fas fa-user-plus"></i> Register Now
                        </a>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += quizCard;
    });
}

// Setup filters
function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterQuizzes);
    }
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterQuizzes);
    }
    
    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', filterQuizzes);
    }
}

// Filter quizzes
function filterQuizzes() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');
    
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    const categoryValue = categoryFilter ? categoryFilter.value : '';
    const difficultyValue = difficultyFilter ? difficultyFilter.value : '';
    
    filteredQuizzes = quizzes.filter(quiz => {
        const matchesSearch = quiz.title.toLowerCase().includes(searchTerm) || 
                            quiz.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryValue || quiz.category === categoryValue;
        const matchesDifficulty = !difficultyValue || quiz.difficulty === difficultyValue;
        
        return matchesSearch && matchesCategory && matchesDifficulty;
    });
    
    displayQuizzes(filteredQuizzes);
}

// Format date helper
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadQuizzes();
});
