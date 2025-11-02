// Events page - Display and filter quizzes dynamically

// Sample quiz data (in production, this would come from backend API)
const quizzes = [
    {
        id: 1,
        title: "HTML Basics Quiz",
        category: "Web Development",
        difficulty: "Beginner",
        date: "2024-12-15",
        description: "Test your knowledge of HTML fundamentals including tags, attributes, and semantic elements.",
        duration: "30 mins",
        questions: 20
    },
    {
        id: 2,
        title: "CSS Flexbox Mastery",
        category: "Web Development",
        difficulty: "Intermediate",
        date: "2024-12-18",
        description: "Master CSS Flexbox layout with practical questions covering alignment, distribution, and responsive design.",
        duration: "45 mins",
        questions: 25
    },
    {
        id: 3,
        title: "JavaScript ES6+ Features",
        category: "Programming",
        difficulty: "Advanced",
        date: "2024-12-20",
        description: "Explore modern JavaScript features including arrow functions, promises, async/await, and more.",
        duration: "60 mins",
        questions: 30
    },
    {
        id: 4,
        title: "Python Programming Basics",
        category: "Programming",
        difficulty: "Beginner",
        date: "2024-12-22",
        description: "Learn Python fundamentals including variables, data types, loops, and functions.",
        duration: "40 mins",
        questions: 25
    },
    {
        id: 5,
        title: "MySQL Database Design",
        category: "Database",
        difficulty: "Intermediate",
        date: "2024-12-25",
        description: "Understand database normalization, relationships, and SQL queries for efficient data management.",
        duration: "50 mins",
        questions: 28
    },
    {
        id: 6,
        title: "React.js Fundamentals",
        category: "Web Development",
        difficulty: "Intermediate",
        date: "2024-12-28",
        description: "Build dynamic user interfaces with React components, hooks, and state management.",
        duration: "55 mins",
        questions: 30
    },
    {
        id: 7,
        title: "Node.js Backend Development",
        category: "Programming",
        difficulty: "Advanced",
        date: "2025-01-05",
        description: "Create robust backend applications using Node.js, Express, and REST APIs.",
        duration: "60 mins",
        questions: 35
    },
    {
        id: 8,
        title: "UI/UX Design Principles",
        category: "Design",
        difficulty: "Beginner",
        date: "2025-01-08",
        description: "Learn essential design principles for creating user-friendly and visually appealing interfaces.",
        duration: "35 mins",
        questions: 20
    },
    {
        id: 9,
        title: "MongoDB NoSQL Database",
        category: "Database",
        difficulty: "Intermediate",
        date: "2025-01-10",
        description: "Master document-based database design with MongoDB collections, queries, and aggregation.",
        duration: "45 mins",
        questions: 26
    },
    {
        id: 10,
        title: "Data Science with Python",
        category: "Data Science",
        difficulty: "Advanced",
        date: "2025-01-12",
        description: "Analyze and visualize data using Python libraries like NumPy, Pandas, and Matplotlib.",
        duration: "70 mins",
        questions: 40
    },
    {
        id: 11,
        title: "Git Version Control",
        category: "Programming",
        difficulty: "Beginner",
        date: "2025-01-15",
        description: "Master version control with Git including branches, merging, and collaboration workflows.",
        duration: "30 mins",
        questions: 22
    },
    {
        id: 12,
        title: "Bootstrap 5 Responsive Design",
        category: "Web Development",
        difficulty: "Beginner",
        date: "2025-01-18",
        description: "Create responsive websites quickly using Bootstrap 5 grid system and components.",
        duration: "40 mins",
        questions: 24
    }
];

// Store quizzes in localStorage for use across pages
localStorage.setItem('quizzes', JSON.stringify(quizzes));

let filteredQuizzes = [...quizzes];

// Display quizzes
function displayQuizzes(quizzesToDisplay) {
    const container = document.getElementById('quizzesContainer');
    const noResults = document.getElementById('noResults');
    const quizCount = document.getElementById('quizCount');
    
    container.innerHTML = '';
    
    if (quizzesToDisplay.length === 0) {
        container.classList.add('d-none');
        noResults.classList.remove('d-none');
        quizCount.textContent = '0';
        return;
    }
    
    container.classList.remove('d-none');
    noResults.classList.add('d-none');
    quizCount.textContent = quizzesToDisplay.length;
    
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
                            <small><i class="fas fa-clock"></i> ${quiz.duration}</small>
                        </div>
                        <div class="d-flex justify-content-between text-muted mb-3">
                            <small><i class="fas fa-question-circle"></i> ${quiz.questions} Questions</small>
                        </div>
                        <a href="register.html?quiz=${quiz.id}" class="btn btn-primary w-100">
                            <i class="fas fa-user-plus"></i> Register Now
                        </a>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += quizCard;
    });
}

// Filter quizzes
function filterQuizzes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const difficultyFilter = document.getElementById('difficultyFilter').value;
    
    filteredQuizzes = quizzes.filter(quiz => {
        const matchesSearch = quiz.title.toLowerCase().includes(searchTerm) || 
                            quiz.description.toLowerCase().includes(searchTerm);
        const matchesCategory = !categoryFilter || quiz.category === categoryFilter;
        const matchesDifficulty = !difficultyFilter || quiz.difficulty === difficultyFilter;
        
        return matchesSearch && matchesCategory && matchesDifficulty;
    });
    
    displayQuizzes(filteredQuizzes);
}

// Format date helper
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initial display
    displayQuizzes(quizzes);
    
    // Search input
    document.getElementById('searchInput').addEventListener('input', filterQuizzes);
    
    // Category filter
    document.getElementById('categoryFilter').addEventListener('change', filterQuizzes);
    
    // Difficulty filter
    document.getElementById('difficultyFilter').addEventListener('change', filterQuizzes);
});
