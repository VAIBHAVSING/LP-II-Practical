# 📚 QuizMaster - Online Quiz Platform

<div align="center">

![QuizMaster Logo](https://img.shields.io/badge/QuizMaster-v2.1-blueviolet?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-v18+-brightgreen?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)

**A modern, full-stack quiz platform built with Node.js, Express, and MongoDB Atlas**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [API](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 🌟 Overview

QuizMaster is a comprehensive online quiz platform designed for educational institutions and organizations. It features a responsive frontend, robust backend API, and MongoDB Atlas integration for scalable data storage.

### ✨ Key Highlights

- 🎨 **Modern UI** with Dark/Light theme toggle
- 📱 **Fully Responsive** design (Bootstrap 5)
- 🔐 **Dual Authentication** - Separate student & admin portals
- 👤 **Student Dashboard** with profile and quiz management
- 🎯 **Smart Filtering** by category and difficulty
- 🔍 **Real-time Search** functionality
- ✅ **Form Validation** with instant feedback
- 🌐 **RESTful API** architecture
- ☁️ **MongoDB Atlas** cloud database
- 🚀 **Easy Deployment** ready
- 🔒 **Secure Sessions** with remember me option

---

## 📋 Features

### For Students
- ✅ **Dedicated Registration** - Create account with instant access
- ✅ **Student Login Portal** - Secure authentication with session management
- ✅ **Personal Dashboard** - View profile, statistics, and available quizzes
- ✅ Browse quizzes by category, difficulty, and keywords
- ✅ Real-time search with instant results
- ✅ Register for quizzes with one click
- ✅ View quiz details (duration, questions, passing score)
- ✅ **Change Password** - Update credentials securely
- ✅ Modern, intuitive user interface
- ✅ Dark/Light theme support

### For Administrators
- ✅ **Admin Registration** - Self-service admin account creation
- ✅ **Secure Admin Login** - Enhanced authentication portal
- ✅ Separate admin dashboard with statistics and analytics
- ✅ Create, Read, Update, Delete (CRUD) quizzes
- ✅ View all quiz registrations
- ✅ Filter registrations by quiz
- ✅ Manage quiz status (Active/Inactive)

### Technical Features
- ✅ Node.js + Express backend
- ✅ MongoDB Atlas cloud database with connection pooling
- ✅ RESTful API with proper error handling
- ✅ Client-side and server-side validation
- ✅ Responsive Bootstrap 5 design
- ✅ Theme persistence with localStorage
- ✅ Optimized database queries with indexes
- ✅ Environment-based configuration
- ✅ **Production-Ready**: Compression, caching, security headers
- ✅ **Security**: Rate limiting, input sanitization, helmet protection
- ✅ **Performance**: Response compression, static file caching
- ✅ **Reliability**: Graceful shutdown, health checks, error recovery
- ✅ **Deployment**: Render-optimized with dynamic API configuration

---

## 🚀 Demo

### Live Demo
Coming soon! (Deploy to Heroku/Vercel/Railway)

### Screenshots

<details>
<summary>Click to view screenshots</summary>

#### Home Page
![Home Page](docs/screenshots/home.png)

#### Quiz Listing
![Quiz Listing](docs/screenshots/quizzes.png)

#### Admin Dashboard
![Admin Dashboard](docs/screenshots/admin-dashboard.png)

#### Dark Theme
![Dark Theme](docs/screenshots/dark-theme.png)

</details>

---

## 🛠️ Tech Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Custom styles with CSS variables
- **JavaScript (ES6+)** - Modern JS features
- **Bootstrap 5.3.0** - Responsive framework
- **Font Awesome 6.4.0** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.18+** - Web framework
- **MongoDB 6.3+** - NoSQL database driver
- **CORS** - Cross-origin resource sharing
- **Body-parser** - Request body parsing
- **Dotenv** - Environment configuration

### Database
- **MongoDB Atlas** - Cloud-hosted MongoDB
- Collections: `quizzes`, `registrations`, `admin_users`
- Text indexes for search functionality
- Compound indexes for performance

---

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (free tier available)
- Git
- npm or yarn

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/LP-II-Practical.git
cd LP-II-Practical

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Edit .env file with your MongoDB credentials
# Add your MongoDB Atlas connection string

# 5. Start the server
npm start

# 6. Open browser
Visit http://localhost:3000
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/
DB_NAME=quizmaster

# Server Configuration
PORT=3000
NODE_ENV=development

# Admin Credentials
ADMIN_EMAIL=admin@quizmaster.com
ADMIN_PASSWORD=admin123

# Session Secret
SESSION_SECRET=your_random_secret_key_here

# CORS
CORS_ORIGIN=http://localhost:3000
```

### MongoDB Atlas Setup

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string
6. Replace `<password>` with your database user password
7. Add connection string to `.env` file

### Seed Sample Data

```bash
# Seed the database with sample quizzes and admin user
npm run seed

# Or manually via API
curl -X POST http://localhost:3000/api/seed
```

---

## 📁 Project Structure

```
LP-II-Practical/
│
├── index.html              # Home page
├── about.html              # About page
├── contact.html            # Contact page
├── events.html             # Quiz listing page
├── register.html           # Registration form
│
├── admin/
│   ├── login.html          # Admin login
│   └── dashboard.html      # Admin dashboard
│
├── css/
│   └── style.css           # Custom styles with theme support
│
├── js/
│   ├── main.js             # Common utilities & theme toggle
│   ├── events.js           # Quiz display & filtering
│   ├── validation.js       # Form validation logic
│   └── admin.js            # Admin dashboard functionality
│
├── server.js               # Express server with MongoDB
├── package.json            # Node.js dependencies
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── LICENSE                 # MIT License
└── README.md               # This file
```

---

## 🔌 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Health Check
```http
GET /api/health
```
Response: `{ status: 'OK', database: 'Connected' }`

#### Quizzes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quizzes` | Get all quizzes |
| GET | `/api/quizzes/:id` | Get single quiz |
| POST | `/api/quizzes` | Create new quiz (Admin) |
| PUT | `/api/quizzes/:id` | Update quiz (Admin) |
| DELETE | `/api/quizzes/:id` | Delete quiz (Admin) |

#### Registrations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/register` | Register for quiz |
| GET | `/api/registrations` | Get all registrations (Admin) |
| GET | `/api/registrations/quiz/:quizId` | Get registrations by quiz |

#### Admin

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/login` | Admin authentication |
| GET | `/api/admin/stats` | Dashboard statistics |

#### Database

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/seed` | Seed sample data |

### Example Requests

#### Create Quiz
```bash
curl -X POST http://localhost:3000/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{
    "title": "JavaScript Basics",
    "description": "Test your JS knowledge",
    "category": "Programming",
    "difficulty": "Beginner",
    "duration": 30,
    "totalQuestions": 15,
    "passingScore": 60
  }'
```

#### Register for Quiz
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "mobile": "1234567890",
    "quizId": "quiz_id_here"
  }'
```

---

## 🎨 Theme Support

The application supports **Light** and **Dark** themes with smooth transitions.

### How to Use
- Click the moon/sun icon in the navigation bar
- Theme preference is saved in `localStorage`
- Persists across page reloads

### Customize Colors
Edit CSS variables in `css/style.css`:

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    /* Add more colors */
}

[data-theme="dark"] {
    --bg-color: #1a1a2e;
    --text-color: #eaeaea;
    /* Dark theme colors */
}
```

---

## 🔐 Admin Access

### Default Credentials
```
Email: admin@quizmaster.com
Password: admin123
```

⚠️ **Important:** Change these credentials in production!

### Admin Features
1. Login at `/admin/login.html`
2. View dashboard statistics
3. Manage quizzes (Add/Edit/Delete)
4. View all registrations
5. Filter registrations by quiz

---

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices (< 576px)
- 📱 Tablets (576px - 992px)
- 💻 Laptops (992px - 1200px)
- 🖥️ Desktops (> 1200px)

### Breakpoints
```css
Mobile:    < 576px
Tablet:    ≥ 576px
Laptop:    ≥ 992px
Desktop:   ≥ 1200px
```

---

## 🧪 Testing

### Manual Testing Checklist

**Frontend:**
- [ ] Home page loads correctly
- [ ] All navigation links work
- [ ] Theme toggle works (light/dark)
- [ ] Quiz search is functional
- [ ] Category filter works
- [ ] Difficulty filter works
- [ ] Registration form validates correctly
- [ ] Success modal appears after registration

**Backend:**
- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] All API endpoints respond correctly
- [ ] CRUD operations work for quizzes
- [ ] Registrations are saved to database
- [ ] Admin login authenticates correctly
- [ ] Dashboard stats load properly

### Run Tests
```bash
# Start the server
npm start

# In another terminal, test endpoints
npm test  # (if you add test scripts)
```

---

## 🚀 Deployment

### Deploy to Render (Recommended) ⭐

QuizMaster is optimized for deployment on Render's free tier with automatic HTTPS and continuous deployment.

**Quick Deploy:**
1. Push your code to GitHub
2. Sign up at [Render](https://render.com)
3. Create a new Web Service
4. Connect your GitHub repository
5. Set environment variables (MONGODB_URI, NODE_ENV=production)
6. Deploy!

**📖 [Complete Render Deployment Guide](./RENDER_DEPLOYMENT.md)**

**Features:**
- ✅ Free tier available (750 hours/month)
- ✅ Automatic HTTPS/SSL certificates
- ✅ Auto-deploy from GitHub
- ✅ Built-in health checks
- ✅ Environment variables management
- ✅ Real-time logs and metrics

### Deploy to Heroku

```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set DB_NAME=quizmaster
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Open app
heroku open
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Deploy to Railway

```bash
# Connect GitHub repo to Railway
# Add environment variables in Railway dashboard
# Deploy automatically on push
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Use ES6+ JavaScript features
- Follow consistent naming conventions
- Add comments for complex logic
- Test your changes before submitting
- Update documentation if needed

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [Bootstrap](https://getbootstrap.com/) for the UI framework
- [Font Awesome](https://fontawesome.com/) for icons
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database hosting
- [Express.js](https://expressjs.com/) for the backend framework
- [Node.js](https://nodejs.org/) for the runtime environment

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/LP-II-Practical/issues) page
2. Create a new issue with details
3. Reach out via email

---

## 🗺️ Roadmap

### v2.1 (Upcoming)
- [ ] User authentication for students
- [ ] Quiz attempt functionality
- [ ] Results and scoring system
- [ ] Email notifications
- [ ] PDF certificate generation
- [ ] Analytics dashboard
- [ ] Export registrations to Excel
- [ ] Quiz categories management

### v3.0 (Future)
- [ ] Real-time quiz sessions
- [ ] Leaderboards
- [ ] Question bank management
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Payment integration
- [ ] Social media sharing

---

## 📊 Project Stats

![GitHub Stars](https://img.shields.io/github/stars/yourusername/LP-II-Practical?style=social)
![GitHub Forks](https://img.shields.io/github/forks/yourusername/LP-II-Practical?style=social)
![GitHub Issues](https://img.shields.io/github/issues/yourusername/LP-II-Practical)
![GitHub Pull Requests](https://img.shields.io/github/issues-pr/yourusername/LP-II-Practical)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ for educational purposes

</div>
