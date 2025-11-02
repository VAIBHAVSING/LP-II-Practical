# 🚀 SETUP GUIDE - QuizMaster v2.0

## What's New in v2.0?

✨ **Major Updates:**
- ☁️ **MongoDB Atlas** - Cloud database (replaced MySQL)
- 🎨 **Theme Toggle** - Dark/Light mode support
- 🎯 **Consistent UI** - Unified color scheme throughout
- 📦 **Environment Config** - .env file for credentials
- 📝 **MIT License** - Open source licensing
- 🐙 **GitHub Ready** - Public repository created

---

## 📋 Prerequisites

Before you begin, ensure you have:
- ✅ Node.js v18+ installed
- ✅ MongoDB Atlas account (free tier works!)
- ✅ Git installed
- ✅ Code editor (VS Code recommended)
- ✅ Modern web browser

---

## 🎯 Quick Setup (5 Minutes)

### Step 1: Clone the Repository
```bash
git clone https://github.com/VAIBHAVSING/LP-II-Practical.git
cd LP-II-Practical
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- express (Web framework)
- mongodb (Database driver)
- cors (Cross-origin support)
- body-parser (Request parsing)
- dotenv (Environment variables)
- nodemon (Development tool)

### Step 3: Setup MongoDB Atlas

#### 3.1 Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Sign up with email or Google
4. Choose FREE tier (M0)

#### 3.2 Create Cluster
1. Select Cloud Provider (AWS recommended)
2. Choose Region closest to you
3. Name: `QuizMaster-Cluster`
4. Click "Create"
5. Wait 3-5 minutes for cluster creation

#### 3.3 Setup Database Access
1. Click "Database Access" in left sidebar
2. Click "Add New Database User"
3. Authentication Method: Password
4. Username: `quizadmin`
5. Password: Generate secure password (save it!)
6. Database User Privileges: `Read and write to any database`
7. Click "Add User"

#### 3.4 Setup Network Access
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. For Development: Click "Allow Access from Anywhere" (0.0.0.0/0)
4. For Production: Add your specific IP
5. Click "Confirm"

#### 3.5 Get Connection String
1. Click "Database" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Driver: Node.js
5. Version: 6.3 or later
6. Copy the connection string
7. It looks like: `mongodb+srv://quizadmin:<password>@cluster0.xxxxx.mongodb.net/`

### Step 4: Configure Environment Variables

Create `.env` file in project root:

```bash
# Copy example file
cp .env.example .env

# Edit .env file
nano .env  # or use your favorite editor
```

Add your MongoDB credentials:

```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://quizadmin:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/
DB_NAME=quizmaster

# Server Configuration
PORT=3000
NODE_ENV=development

# Admin Credentials (change in production!)
ADMIN_EMAIL=admin@quizmaster.com
ADMIN_PASSWORD=admin123

# Session Secret (change this!)
SESSION_SECRET=your_random_secret_key_here

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Important:** 
- Replace `YOUR_PASSWORD_HERE` with your MongoDB user password
- Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- Change admin credentials before deployment!

### Step 5: Seed the Database

```bash
# Start the server
npm start

# In another terminal, seed data
npm run seed

# Or use curl
curl -X POST http://localhost:3000/api/seed
```

This will create:
- ✅ 12 sample quizzes
- ✅ Admin user account
- ✅ Database indexes

### Step 6: Open the Application

```bash
# Server is running at:
http://localhost:3000

# Admin login:
http://localhost:3000/admin/login.html
Email: admin@quizmaster.com
Password: admin123
```

---

## 🎨 Features Overview

### Theme Toggle
- Click the moon/sun icon in navbar
- Switches between light and dark mode
- Preference saved in localStorage
- Smooth color transitions

### For Students
1. **Home Page** - Overview and features
2. **Quizzes Page** - Browse all available quizzes
3. **Search** - Find quizzes by title or description
4. **Filter** - By category (Web Dev, Programming, Database, etc.)
5. **Register** - Fill form with validation
6. **Contact** - Get in touch via form

### For Admin
1. **Login** - Secure authentication
2. **Dashboard** - View statistics (quizzes, registrations, active)
3. **Manage Quizzes** - Create, edit, delete quizzes
4. **View Registrations** - See all student registrations
5. **Filter** - Registrations by specific quiz

---

## 🔧 Development Mode

### Run with Auto-Reload
```bash
npm run dev
```

Uses nodemon to auto-restart on file changes.

### Access MongoDB Data

**Option 1: MongoDB Compass** (GUI)
1. Download from https://www.mongodb.com/products/compass
2. Connect using your connection string
3. Browse collections: `quizzes`, `registrations`, `admin_users`

**Option 2: MongoDB Atlas Dashboard**
1. Login to MongoDB Atlas
2. Click "Browse Collections"
3. View/Edit data directly

### API Testing

Use curl or Postman:

```bash
# Health check
curl http://localhost:3000/api/health

# Get all quizzes
curl http://localhost:3000/api/quizzes

# Get dashboard stats
curl http://localhost:3000/api/admin/stats

# Test registration
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "mobile": "1234567890",
    "quizId": "quiz_id_here"
  }'
```

---

## 📁 Important Files

### Configuration Files
- `.env` - Your environment variables (DO NOT COMMIT!)
- `.env.example` - Template for environment variables
- `package.json` - Node.js dependencies
- `.gitignore` - Files to ignore in git

### Source Files
- `server.js` - Express backend with MongoDB
- `index.html` - Home page
- `events.html` - Quiz listing page
- `register.html` - Registration form
- `admin/dashboard.html` - Admin panel

### JavaScript Files
- `js/main.js` - Common utilities + theme toggle
- `js/events.js` - Quiz display & filtering
- `js/validation.js` - Form validation
- `js/admin.js` - Admin dashboard logic

### Styles
- `css/style.css` - Custom styles with theme variables

---

## 🐛 Troubleshooting

### Error: "MongoDB connection error"
**Solution:**
1. Check `.env` file exists
2. Verify MongoDB URI is correct
3. Check password has no special characters (or URL encode them)
4. Ensure IP is whitelisted in MongoDB Atlas
5. Check internet connection

### Error: "Cannot find module 'mongodb'"
**Solution:**
```bash
npm install
```

### Error: "Port 3000 already in use"
**Solution:**
```bash
# Option 1: Kill the process
lsof -ti:3000 | xargs kill -9

# Option 2: Use different port
# Edit .env: PORT=3001
```

### Error: "Collection does not exist"
**Solution:**
```bash
# Seed the database
npm run seed
```

### Theme toggle not working
**Solution:**
1. Hard refresh browser (Ctrl+F5)
2. Clear browser cache
3. Check browser console for errors
4. Ensure `js/main.js` is loaded

### Forms not validating
**Solution:**
1. Check `js/validation.js` is loaded
2. Open browser console for errors
3. Ensure all required fields have IDs matching validation script

---

## 📦 Project Structure

```
LP-II-Practical/
│
├── 📄 .env                 # Your environment config (create this!)
├── 📄 .env.example         # Template for .env
├── 📄 .gitignore          # Git ignore rules
├── 📄 LICENSE             # MIT License
├── 📄 README.md           # Main documentation
├── 📄 SETUP_GUIDE.md      # This file
├── 📄 package.json        # Dependencies
├── 📄 server.js           # Backend server
│
├── 📁 admin/
│   ├── login.html         # Admin login page
│   └── dashboard.html     # Admin dashboard
│
├── 📁 css/
│   └── style.css          # Styles with theme support
│
├── 📁 js/
│   ├── main.js            # Common + theme toggle
│   ├── events.js          # Quiz display
│   ├── validation.js      # Form validation
│   └── admin.js           # Admin functions
│
├── 📁 docs/               # Documentation (optional)
│
├── 📄 index.html          # Home page
├── 📄 about.html          # About page
├── 📄 contact.html        # Contact page
├── 📄 events.html         # Quiz listing
└── 📄 register.html       # Registration form
```

---

## 🚀 Deployment

### Deploy to Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create quizmaster-app

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set DB_NAME=quizmaster
heroku config:set ADMIN_EMAIL=admin@quizmaster.com
heroku config:set ADMIN_PASSWORD=newpassword123

# Deploy
git push heroku main

# Seed database
heroku run npm run seed

# Open app
heroku open
```

### Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in dashboard
# Visit vercel.com/dashboard
```

### Deploy to Railway
1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

---

## 🎓 Usage Guide

### For Students

1. **Browse Quizzes**
   - Visit homepage
   - Click "Browse Quizzes"
   - Use search or filters

2. **Register for Quiz**
   - Select a quiz
   - Click "Register"
   - Fill form (all fields validated)
   - Submit

3. **Change Theme**
   - Click moon/sun icon in navbar
   - Theme persists across visits

### For Admins

1. **Login**
   - Go to Admin page
   - Use credentials from .env
   - Dashboard appears

2. **Manage Quizzes**
   - Click "Manage Quizzes" tab
   - Add: Click "Add New Quiz" button
   - Edit: Click pencil icon on quiz
   - Delete: Click trash icon (confirms first)

3. **View Registrations**
   - Click "Registrations" tab
   - Filter by quiz if needed
   - View all student details

---

## 📊 Database Collections

### `quizzes` Collection
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  category: String,
  difficulty: String, // Beginner, Intermediate, Advanced
  duration: Number,   // minutes
  totalQuestions: Number,
  passingScore: Number, // percentage
  startDate: String,
  status: String,     // Active, Inactive
  createdAt: Date,
  updatedAt: Date
}
```

### `registrations` Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  mobile: String,
  dob: String,
  college: String,
  course: String,
  year: String,
  quizId: String,
  status: String,    // Registered
  registeredAt: Date,
  createdAt: Date
}
```

### `admin_users` Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String,  // Plain text (change to bcrypt in production!)
  role: String,      // admin
  createdAt: Date
}
```

---

## 🔒 Security Notes

**For Production:**

1. **Passwords**: Use bcrypt to hash passwords
```bash
npm install bcrypt
```

2. **JWT Tokens**: Implement JWT for session management
```bash
npm install jsonwebtoken
```

3. **HTTPS**: Use SSL/TLS certificates

4. **Rate Limiting**: Prevent brute force attacks
```bash
npm install express-rate-limit
```

5. **Input Sanitization**: Validate and sanitize all inputs
```bash
npm install express-validator
```

6. **MongoDB**: 
   - Whitelist specific IPs
   - Use strong passwords
   - Enable database audit logs

---

## 📞 Support

Need help? 

1. **Check Documentation**
   - README.md
   - This SETUP_GUIDE.md

2. **Common Issues**
   - See Troubleshooting section above

3. **GitHub Issues**
   - https://github.com/VAIBHAVSING/LP-II-Practical/issues

4. **MongoDB Atlas Docs**
   - https://docs.atlas.mongodb.com/

---

## ✅ Testing Checklist

Before submitting/deploying:

- [ ] Server starts without errors
- [ ] MongoDB connection successful
- [ ] Home page loads correctly
- [ ] Theme toggle works (light/dark)
- [ ] Quiz search works
- [ ] Quiz filters work (category, difficulty)
- [ ] Registration form validates correctly
- [ ] Registration saves to database
- [ ] Admin login works
- [ ] Dashboard shows correct stats
- [ ] Can create new quiz
- [ ] Can edit quiz
- [ ] Can delete quiz
- [ ] Can view all registrations
- [ ] Responsive on mobile
- [ ] No console errors

---

## 🎉 You're All Set!

Your QuizMaster application is now:
- ✅ Connected to MongoDB Atlas
- ✅ Has dark/light theme toggle
- ✅ Fully functional and responsive
- ✅ Ready for development or deployment
- ✅ Open source with MIT License
- ✅ Published on GitHub

**Next Steps:**
1. Customize the design
2. Add more features
3. Deploy to production
4. Share with others!

---

**Happy Coding! 🚀**

For questions or contributions, visit:
https://github.com/VAIBHAVSING/LP-II-Practical
