# Authentication System Documentation

## Overview

QuizMaster now features a comprehensive dual authentication system with separate registration and login flows for **Students** and **Admins**. This system provides secure access control and role-based functionality.

## Key Features

### 🎓 Student Authentication

#### Registration (`/student-register.html`)
- **Personal Information**
  - First Name & Last Name (2-50 characters, letters only)
  - Email Address (unique, validated)
  - Password (minimum 8 characters with uppercase, lowercase, and number)
  - Mobile Number (10 digits)
  - Date of Birth

- **Educational Information**
  - College/Institution
  - Course (BCA, MCA, B.Tech, M.Tech, BSc CS, Other)
  - Year of Study (1st to Final Year)

- **Features**
  - Real-time password validation
  - Password visibility toggle
  - Email uniqueness check
  - Instant credential display after registration
  - No email verification required
  - Terms and conditions acceptance

#### Login (`/student-login.html`)
- Email and password authentication
- "Remember Me" option (uses localStorage vs sessionStorage)
- Password visibility toggle
- Forgot password support
- Automatic redirect if already logged in
- Link to registration page

#### Student Dashboard (`/student-dashboard.html`)
- **Statistics Overview**
  - Total available quizzes
  - Completed quizzes count
  - Pending quizzes count
  - Average score percentage

- **Profile Section**
  - View personal details
  - College/Course information
  - Email and contact details

- **Quiz Management**
  - Browse all available quizzes
  - Register for quizzes
  - View quiz details (duration, difficulty, questions)

- **Quick Actions**
  - Browse all quizzes
  - Change password
  - Logout functionality

### 👨‍💼 Admin Authentication

#### Registration (`/admin/register.html`)
- **Required Fields**
  - Full Name (2-50 characters)
  - Email Address (unique)
  - Password (minimum 8 characters with uppercase, lowercase, number, and special character)
  - Confirm Password
  - Department/Role selection

- **Features**
  - Stricter password requirements than students
  - Email uniqueness validation
  - Registration approval workflow
  - Instant account activation
  - Link to student registration

#### Login (`/admin/login.html`)
- Email and password authentication
- "Remember Me" option
- Password visibility toggle
- Demo credentials displayed
- Link to admin registration
- Automatic redirect if logged in

## API Endpoints

### Student Endpoints

#### POST `/api/student/register`
Register a new student account.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123",
  "mobile": "1234567890",
  "dob": "2000-01-01",
  "college": "ABC University",
  "course": "B.Tech",
  "year": "3rd Year"
}
```

**Response (201):**
```json
{
  "message": "Registration successful",
  "student": {
    "id": "60d5ec49f1b2c8b5f8e4a1b2",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### POST `/api/student/check-email`
Check if email is already registered.

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response:**
```json
{
  "exists": true
}
```

#### POST `/api/student/login`
Authenticate student login.

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "student": {
    "id": "60d5ec49f1b2c8b5f8e4a1b2",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "college": "ABC University",
    "course": "B.Tech",
    "year": "3rd Year"
  }
}
```

#### GET `/api/student/profile/:id`
Get student profile information.

**Response (200):**
```json
{
  "_id": "60d5ec49f1b2c8b5f8e4a1b2",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "mobile": "1234567890",
  "dob": "2000-01-01",
  "college": "ABC University",
  "course": "B.Tech",
  "year": "3rd Year",
  "role": "student",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

#### POST `/api/student/change-password`
Change student password.

**Request Body:**
```json
{
  "studentId": "60d5ec49f1b2c8b5f8e4a1b2",
  "currentPassword": "OldPass123",
  "newPassword": "NewSecurePass456"
}
```

**Response (200):**
```json
{
  "message": "Password changed successfully"
}
```

### Admin Endpoints

#### POST `/api/admin/register`
Register a new admin account.

**Request Body:**
```json
{
  "name": "Admin Name",
  "email": "admin@example.com",
  "password": "SecureAdminPass@123",
  "department": "IT"
}
```

**Response (201):**
```json
{
  "message": "Admin registration successful",
  "admin": {
    "id": "60d5ec49f1b2c8b5f8e4a1b3",
    "email": "admin@example.com",
    "name": "Admin Name"
  }
}
```

#### POST `/api/admin/check-email`
Check if admin email exists.

**Request Body:**
```json
{
  "email": "admin@example.com"
}
```

**Response:**
```json
{
  "exists": true
}
```

#### POST `/api/admin/login`
Authenticate admin login.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "admin": {
    "id": "60d5ec49f1b2c8b5f8e4a1b3",
    "email": "admin@example.com",
    "name": "Admin Name"
  }
}
```

## Security Features

### Password Requirements

**Students:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Admins:**
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&*(),.?":{}|<>)

### Data Validation
- Email format validation
- Name validation (letters and spaces only, 2-50 chars)
- Mobile number validation (exactly 10 digits)
- Date of birth validation
- Duplicate email prevention

### Session Management
- localStorage for "Remember Me" sessions
- sessionStorage for temporary sessions
- Automatic session checks on protected pages
- Logout clears all session data

## Database Collections

### `students` Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique, indexed),
  password: String,
  mobile: String,
  dob: Date,
  college: String,
  course: String,
  year: String,
  role: "student",
  createdAt: Date,
  updatedAt: Date
}
```

### `admin_users` Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String,
  department: String,
  role: "admin",
  status: "active" | "pending",
  createdAt: Date,
  updatedAt: Date
}
```

## Navigation Structure

### Public Pages
- Home (`/index.html`)
- About (`/about.html`)
- Quizzes (`/events.html`)
- Contact (`/contact.html`)
- Quiz Registration (`/register.html`) - For specific quiz registration

### Student Pages
- Student Registration (`/student-register.html`)
- Student Login (`/student-login.html`)
- Student Dashboard (`/student-dashboard.html`) - Protected

### Admin Pages
- Admin Login (`/admin/login.html`)
- Admin Registration (`/admin/register.html`)
- Admin Dashboard (`/admin/dashboard.html`) - Protected

## Usage Guide

### For Students

1. **Registration:**
   - Navigate to `/student-register.html`
   - Fill in all required personal and educational information
   - Choose a strong password
   - Accept terms and conditions
   - Click "Create Account"
   - Your login credentials will be displayed immediately

2. **Login:**
   - Navigate to `/student-login.html`
   - Enter your registered email and password
   - Optionally check "Remember Me" for persistent login
   - Click "Login"
   - You'll be redirected to your dashboard

3. **Dashboard:**
   - View your profile information
   - Browse available quizzes
   - Register for quizzes
   - Change your password
   - Logout when done

### For Admins

1. **Registration:**
   - Navigate to `/admin/register.html`
   - Fill in your name, email, and create a secure password
   - Select your department
   - Accept terms and conditions
   - Click "Request Admin Access"
   - Your account is activated immediately

2. **Login:**
   - Navigate to `/admin/login.html`
   - Enter your credentials
   - Optionally check "Remember Me"
   - Click "Login"
   - Access admin dashboard

### Demo Accounts

**Admin Account:**
- Email: admin@quizmaster.com
- Password: admin123

## File Structure

```
Quiz-app/
├── student-login.html          # Student login page
├── student-register.html       # Student registration page
├── student-dashboard.html      # Student dashboard
├── admin/
│   ├── login.html             # Admin login page
│   └── register.html          # Admin registration page
├── js/
│   ├── student-auth.js        # Student authentication logic
│   ├── student-dashboard.js   # Student dashboard logic
│   └── admin-auth.js          # Admin authentication logic
└── server.js                  # Backend API endpoints
```

## Testing Checklist

### Student Authentication
- [ ] Register new student account
- [ ] Check email validation
- [ ] Check password validation
- [ ] Login with registered credentials
- [ ] Test "Remember Me" functionality
- [ ] Access student dashboard
- [ ] Change password
- [ ] Register for quiz
- [ ] Logout

### Admin Authentication
- [ ] Register new admin account
- [ ] Check stricter password requirements
- [ ] Login with admin credentials
- [ ] Test "Remember Me" functionality
- [ ] Access admin dashboard
- [ ] Verify admin-only features

### Security
- [ ] Cannot register with existing email
- [ ] Cannot login with wrong password
- [ ] Protected pages redirect to login
- [ ] Session persists on refresh (with Remember Me)
- [ ] Session clears on logout

## Future Enhancements

- [ ] Email verification for account activation
- [ ] Password reset via email
- [ ] Two-factor authentication (2FA)
- [ ] OAuth integration (Google, Facebook)
- [ ] Role-based permissions system
- [ ] Account suspension/deactivation
- [ ] Login history tracking
- [ ] Password encryption (bcrypt)
- [ ] Rate limiting for login attempts
- [ ] CAPTCHA for bot prevention

## Troubleshooting

### Common Issues

**Issue:** Cannot login after registration
- **Solution:** Check if you're entering the correct email and password. Passwords are case-sensitive.

**Issue:** Email already exists error
- **Solution:** Use a different email or try logging in if you've registered before.

**Issue:** Dashboard not loading
- **Solution:** Clear browser cache and cookies, then login again.

**Issue:** Session expires immediately
- **Solution:** Make sure cookies/localStorage are enabled in your browser.

## Support

For issues or questions:
- Email: admin@quizmaster.com
- GitHub Issues: [Repository URL]

---

**Last Updated:** January 2024
**Version:** 2.1.0
