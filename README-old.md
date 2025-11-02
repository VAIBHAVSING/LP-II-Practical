# 🎓 QuizMaster - Test Quiz Application

A complete full-stack web application for conducting online quizzes, built for college assignment requirements. This LMS-style platform includes student registration, quiz management, and an admin dashboard with CRUD operations.

## 📋 Features

### Student Features
- ✅ Browse available quizzes with search and filter functionality
- ✅ Register for quizzes with complete form validation
- ✅ View quiz details (category, difficulty, duration, questions)
- ✅ Responsive design - works on mobile, tablet, and desktop
- ✅ Modern UI with Bootstrap 5

### Admin Features
- ✅ Secure admin login system
- ✅ Dashboard with statistics overview
- ✅ Full CRUD operations for quizzes (Create, Read, Update, Delete)
- ✅ View all registrations with filtering options
- ✅ Manage quiz categories and difficulty levels

### Technical Features
- ✅ Client-side form validation with JavaScript
- ✅ RESTful API backend with Node.js + Express
- ✅ MySQL database for data persistence
- ✅ Responsive Bootstrap 5 design
- ✅ LocalStorage for frontend state management
- ✅ Clean, semantic HTML5 structure

## 🛠️ Technologies Used

### Frontend
- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5.3.0
- Font Awesome 6.4.0

### Backend
- Node.js
- Express.js 4.18.2
- MySQL 2 (mysql2)
- CORS
- Body-parser

## 📁 Project Structure

```
quiz-app/
├── index.html              # Home page
├── about.html              # About page
├── contact.html            # Contact page with form
├── events.html             # Quiz listing page
├── register.html           # Student registration form
├── admin/
│   ├── login.html         # Admin login page
│   └── dashboard.html     # Admin dashboard
├── css/
│   └── style.css          # Custom styles
├── js/
│   ├── main.js            # Common utilities
│   ├── events.js          # Quiz listing logic
│   ├── validation.js      # Form validation
│   └── admin.js           # Admin dashboard logic
├── server.js              # Express server
├── package.json           # Node dependencies
├── database.sql           # MySQL schema
└── README.md             # This file
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- Any modern web browser

### Step 1: Install Node.js Dependencies

```bash
# Navigate to project directory
cd Quiz-app

# Install dependencies
npm install
```

### Step 2: Setup MySQL Database

1. Start MySQL server
2. Open MySQL Workbench or command line
3. Run the database.sql file:

```bash
mysql -u root -p < database.sql
```

Or manually:
- Open MySQL Workbench
- File → Run SQL Script
- Select `database.sql`
- Execute

4. Update database credentials in `server.js` if needed:

```javascript
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'your_password',  // Change this
    database: 'quizmaster_db'
});
```

### Step 3: Start the Application

#### Option 1: With Backend (Full Functionality)

```bash
# Start Node.js server
npm start

# Server will run on http://localhost:3000
```

#### Option 2: Frontend Only (Demo Mode)

Simply open `index.html` in your browser. The application will use localStorage for data persistence.

## 🔐 Admin Access

**Demo Credentials:**
- Email: `admin@quizmaster.com`
- Password: `admin123`

## 📱 Pages Overview

### 1. Home Page (`index.html`)
- Hero section with call-to-action
- Features showcase
- Statistics display
- Responsive design

### 2. About Page (`about.html`)
- Mission and vision
- How it works section
- Platform features
- Core values

### 3. Contact Page (`contact.html`)
- Contact form with validation
- Contact information
- Google Maps integration
- FAQ accordion

### 4. Quizzes Page (`events.html`)
- Dynamic quiz listing
- Search functionality
- Category filtering
- Difficulty level filtering
- Real-time results count

### 5. Registration Page (`register.html`)
- Complete registration form
- Client-side validation
- Success modal
- Terms and conditions

### 6. Admin Login (`admin/login.html`)
- Secure login form
- Session management
- Password visibility toggle

### 7. Admin Dashboard (`admin/dashboard.html`)
- Statistics overview
- Quiz management (CRUD)
- Registration viewer
- Recent activity

## 🎯 Form Validation Rules

### Registration Form
- **Name**: 2-50 characters, letters only
- **Email**: Valid email format (user@example.com)
- **Mobile**: Exactly 10 digits
- **Date of Birth**: Valid date, user must be at least 18 years old
- **All required fields**: Must be filled

### Contact Form
- **Name**: Required, 2-50 characters
- **Email**: Valid email format
- **Subject**: Required
- **Message**: Minimum 10 characters

## 💾 Database Schema

### quizzes Table
- id (INT, Primary Key)
- title (VARCHAR)
- category (VARCHAR)
- difficulty (ENUM: Beginner, Intermediate, Advanced)
- date (DATE)
- description (TEXT)
- duration (VARCHAR)
- questions (INT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

### registrations Table
- id (INT, Primary Key)
- first_name (VARCHAR)
- last_name (VARCHAR)
- email (VARCHAR)
- mobile (VARCHAR)
- date_of_birth (DATE)
- college (VARCHAR)
- course (VARCHAR)
- year (VARCHAR)
- quiz_id (INT, Foreign Key)
- experience (ENUM)
- registration_date (TIMESTAMP)

## 🔌 API Endpoints

### Quiz Endpoints
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get single quiz
- `POST /api/quizzes` - Create quiz (Admin)
- `PUT /api/quizzes/:id` - Update quiz (Admin)
- `DELETE /api/quizzes/:id` - Delete quiz (Admin)

### Registration Endpoints
- `POST /api/register` - Register for quiz
- `GET /api/registrations` - Get all registrations (Admin)
- `GET /api/registrations/quiz/:quizId` - Get registrations by quiz

### Admin Endpoints
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Dashboard statistics

## 🎨 Customization

### Colors (CSS Variables)
Edit `css/style.css`:

```css
:root {
    --primary-color: #4e73df;
    --secondary-color: #858796;
    --success-color: #1cc88a;
    --warning-color: #f6c23e;
    --danger-color: #e74a3b;
}
```

### Quiz Categories
Edit categories in:
- `js/events.js` (quiz data array)
- `admin/dashboard.html` (category dropdowns)
- `database.sql` (sample data)

## 📊 Sample Data

The database includes 12 sample quizzes across categories:
- Web Development (HTML, CSS, React, Bootstrap)
- Programming (JavaScript, Python, Node.js, Git)
- Database (MySQL, MongoDB)
- Design (UI/UX)
- Data Science (Python)

## 🐛 Troubleshooting

### Database Connection Issues
```javascript
// Check MySQL service is running
// Windows: services.msc → MySQL
// Mac: System Preferences → MySQL
// Linux: sudo systemctl status mysql
```

### Port Already in Use
```javascript
// Change port in server.js
const PORT = 3001; // Change from 3000
```

### CORS Issues
- CORS is already configured in server.js
- If issues persist, check browser console

## 📝 Assignment Requirements Checklist

- ✅ Static web pages (Home, About, Contact, Event List, Registration)
- ✅ Responsive design with Bootstrap 5
- ✅ Form validation using JavaScript
- ✅ Dynamic event list with search and filter
- ✅ Backend with Node.js + Express + MySQL
- ✅ Admin login and authentication
- ✅ CRUD operations for quizzes
- ✅ View registered participants
- ✅ Clean HTML5 semantic structure
- ✅ Professional styling and navigation

## 🚀 Deployment

### For Production:
1. Use environment variables for sensitive data
2. Implement proper password hashing (bcrypt)
3. Add JWT authentication
4. Enable HTTPS
5. Use connection pooling for database
6. Add rate limiting
7. Implement proper error handling
8. Add input sanitization

## 📄 License

This project is created for educational purposes as part of a college assignment.

## 👨‍💻 Author

Created by: [Your Name]
Course: [Your Course]
College: [Your College Name]
Year: 2024

## 🤝 Contributing

This is an academic project. Feel free to fork and modify for your own assignments.

## 📞 Support

For issues or questions:
- Email: info@quizmaster.com
- GitHub Issues: [Create an issue]

## 🎓 Learning Resources

- [MDN Web Docs](https://developer.mozilla.org/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)

---

**Note**: This is a demonstration project for educational purposes. For production use, implement proper security measures including password hashing, input sanitization, HTTPS, and environment variables for sensitive data.

## 🌟 Features to Add (Future Enhancements)

- Email notifications on registration
- Quiz attempt functionality
- Score tracking and leaderboards
- Certificate generation
- Export data to CSV/PDF
- Advanced analytics dashboard
- User profiles
- Quiz timer functionality
- Question bank management
- Bulk quiz import/export

---

Made with ❤️ for college assignment
