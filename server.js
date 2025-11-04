// QuizMaster Backend Server with MongoDB Atlas
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
const compression = require('compression');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// MongoDB Connection
let db;
let mongoClient;
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'quizmaster';

// Message constants
const NO_DB_DEV_MESSAGE = '⚠️  Starting in development mode without database...';

// Connect to MongoDB Atlas with optimized settings
async function connectDB() {
    if (!mongoUri || mongoUri === 'your_mongodb_atlas_connection_string_here') {
        console.error('❌ MongoDB URI not configured');
        console.log('⚠️  Set MONGODB_URI in .env file or environment variables');
        if (isProduction) {
            console.error('🔴 Cannot start in production without database');
            process.exit(1);
        }
        console.log(NO_DB_DEV_MESSAGE);
        return;
    }

    try {
        mongoClient = await MongoClient.connect(mongoUri, { 
            maxPoolSize: 10,
            minPoolSize: 2,
            maxIdleTimeMS: 30000,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        console.log('✅ Connected to MongoDB Atlas');
        db = mongoClient.db(dbName);
        
        // Create indexes for better performance
        await db.collection('quizzes').createIndex({ title: 'text', description: 'text' });
        await db.collection('registrations').createIndex({ email: 1 });
        await db.collection('students').createIndex({ email: 1 }, { unique: true });
        await db.collection('admin_users').createIndex({ email: 1 }, { unique: true });
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        if (isProduction) {
            console.error('🔴 Cannot start in production without database');
            process.exit(1);
        }
        console.log(NO_DB_DEV_MESSAGE);
    }
}

connectDB();

// Security Middleware - Helmet with CSP configuration
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'"]
        }
    },
    crossOriginEmbedderPolicy: false
}));

// Compression Middleware for response optimization
app.use(compression());

// CORS Configuration
// In production, CORS allows same-origin requests automatically
// For cross-origin requests, configure ALLOWED_ORIGINS environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : [];

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or same-origin)
        if (!origin) return callback(null, true);
        
        // In development, allow all origins
        if (!isProduction) return callback(null, true);
        
        // In production, check if origin is in allowed list
        if (allowedOrigins.length > 0 && allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            // If no ALLOWED_ORIGINS set in production, allow all (for initial deployment)
            // TODO: Set ALLOWED_ORIGINS in production for enhanced security
            callback(null, true);
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body Parser Middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Sanitize data to prevent MongoDB Operator Injection
app.use(mongoSanitize());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many login attempts, please try again later.'
});

// Apply rate limiting to API routes
app.use('/api/', limiter);

// Block access to sensitive files and directories
app.use((req, res, next) => {
    const blockedPaths = [
        '/node_modules',
        '/.env',
        '/.git',
        '/package.json',
        '/package-lock.json',
        '/server.js',
        '/.gitignore'
    ];
    
    if (blockedPaths.some(path => req.path.startsWith(path))) {
        return res.status(403).json({ error: 'Access denied' });
    }
    next();
});

// Static Files with caching
// Note: Serves root directory for HTML files. Sensitive files are blocked above
// and not included in deployment (.env, .git, node_modules are in .gitignore)
app.use(express.static(__dirname, {
    maxAge: isProduction ? '1d' : 0,
    etag: true,
    lastModified: true,
    dotfiles: 'deny', // Deny access to dotfiles like .env
    index: false // Disable directory indexing for security
}));

// Middleware to check database connection
const requireDB = (req, res, next) => {
    if (!db) {
        return res.status(503).json({ 
            error: 'Database not available',
            message: 'The server is running but database connection is not established'
        });
    }
    next();
};

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        database: db ? 'Connected' : 'Disconnected',
        environment: NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Get all quizzes
app.get('/api/quizzes', requireDB, async (req, res) => {
    try {
        const quizzes = await db.collection('quizzes').find().sort({ createdAt: -1 }).toArray();
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
});

// Get single quiz
app.get('/api/quizzes/:id', requireDB, async (req, res) => {
    try {
        const quiz = await db.collection('quizzes').findOne({ _id: new ObjectId(req.params.id) });
        if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch quiz' });
    }
});

// Create quiz
app.post('/api/quizzes', requireDB, async (req, res) => {
    try {
        const { title, description, category, difficulty, duration, totalQuestions, passingScore, startDate } = req.body;
        if (!title || !category || !difficulty) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const newQuiz = {
            title,
            description: description || '',
            category,
            difficulty,
            duration: parseInt(duration) || 30,
            totalQuestions: parseInt(totalQuestions) || 10,
            passingScore: parseInt(passingScore) || 60,
            startDate: startDate || new Date().toISOString(),
            status: 'Active',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await db.collection('quizzes').insertOne(newQuiz);
        res.status(201).json({ message: 'Quiz created successfully', quiz: { ...newQuiz, _id: result.insertedId }});
    } catch (error) {
        res.status(500).json({ error: 'Failed to create quiz' });
    }
});

// Update quiz
app.put('/api/quizzes/:id', requireDB, async (req, res) => {
    try {
        const { title, description, category, difficulty, duration, totalQuestions, passingScore, startDate, status } = req.body;
        const updateData = {
            ...(title && { title }),
            ...(description !== undefined && { description }),
            ...(category && { category }),
            ...(difficulty && { difficulty }),
            ...(duration && { duration: parseInt(duration) }),
            ...(totalQuestions && { totalQuestions: parseInt(totalQuestions) }),
            ...(passingScore && { passingScore: parseInt(passingScore) }),
            ...(startDate && { startDate }),
            ...(status && { status }),
            updatedAt: new Date()
        };
        
        const result = await db.collection('quizzes').updateOne({ _id: new ObjectId(req.params.id) }, { $set: updateData });
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Quiz not found' });
        res.json({ message: 'Quiz updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update quiz' });
    }
});

// Delete quiz
app.delete('/api/quizzes/:id', requireDB, async (req, res) => {
    try {
        const result = await db.collection('quizzes').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Quiz not found' });
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete quiz' });
    }
});

// Register for quiz
app.post('/api/register', requireDB, async (req, res) => {
    try {
        const { firstName, lastName, email, mobile, dob, college, course, year, quizId } = req.body;
        if (!firstName || !lastName || !email || !mobile || !quizId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const existing = await db.collection('registrations').findOne({ email, quizId });
        if (existing) return res.status(400).json({ error: 'Already registered for this quiz' });
        
        const newRegistration = {
            firstName, lastName, email, mobile,
            dob: dob || null, college: college || '', course: course || '', year: year || '',
            quizId, status: 'Registered',
            registeredAt: new Date(), createdAt: new Date()
        };
        
        const result = await db.collection('registrations').insertOne(newRegistration);
        res.status(201).json({ message: 'Registration successful', registration: { ...newRegistration, _id: result.insertedId }});
    } catch (error) {
        res.status(500).json({ error: 'Failed to register' });
    }
});

// Get all registrations
app.get('/api/registrations', async (req, res) => {
    try {
        const registrations = await db.collection('registrations').find().sort({ registeredAt: -1 }).toArray();
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch registrations' });
    }
});

// Get registrations by quiz
app.get('/api/registrations/quiz/:quizId', async (req, res) => {
    try {
        const registrations = await db.collection('registrations').find({ quizId: req.params.quizId }).sort({ registeredAt: -1 }).toArray();
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch registrations' });
    }
});

// Student registration
app.post('/api/student/register', requireDB, async (req, res) => {
    try {
        const { firstName, lastName, email, password, mobile, dob, college, course, year } = req.body;
        if (!firstName || !lastName || !email || !password || !mobile) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const existing = await db.collection('students').findOne({ email });
        if (existing) return res.status(400).json({ error: 'Email already registered' });
        
        const newStudent = {
            firstName, lastName, email, password, mobile,
            dob: dob || null, college: college || '', course: course || '', year: year || '',
            role: 'student',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await db.collection('students').insertOne(newStudent);
        res.status(201).json({ 
            message: 'Registration successful', 
            student: { id: result.insertedId, email: newStudent.email, firstName: newStudent.firstName, lastName: newStudent.lastName }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register' });
    }
});

// Check if email exists
app.post('/api/student/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        const existing = await db.collection('students').findOne({ email });
        res.json({ exists: !!existing });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check email' });
    }
});

// Student login (with rate limiting)
app.post('/api/student/login', requireDB, authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const student = await db.collection('students').findOne({ email });
        if (!student || student.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        res.json({ 
            message: 'Login successful', 
            student: { 
                id: student._id, 
                email: student.email, 
                firstName: student.firstName, 
                lastName: student.lastName,
                college: student.college,
                course: student.course,
                year: student.year
            }
        });
    } catch (error) {
        console.error('Student login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get student profile
app.get('/api/student/profile/:id', async (req, res) => {
    try {
        const student = await db.collection('students').findOne({ _id: new ObjectId(req.params.id) });
        if (!student) return res.status(404).json({ error: 'Student not found' });
        
        const { password, ...studentData } = student;
        res.json(studentData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
});

// Change student password
app.post('/api/student/change-password', async (req, res) => {
    try {
        const { studentId, currentPassword, newPassword } = req.body;
        
        const student = await db.collection('students').findOne({ _id: new ObjectId(studentId) });
        if (!student || student.password !== currentPassword) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }
        
        await db.collection('students').updateOne(
            { _id: new ObjectId(studentId) },
            { $set: { password: newPassword, updatedAt: new Date() }}
        );
        
        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to change password' });
    }
});

// Admin registration
app.post('/api/admin/register', async (req, res) => {
    try {
        const { name, email, password, department } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const existing = await db.collection('admin_users').findOne({ email });
        if (existing) return res.status(400).json({ error: 'Email already registered' });
        
        const newAdmin = {
            name,
            email,
            password,
            department: department || '',
            role: 'admin',
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await db.collection('admin_users').insertOne(newAdmin);
        res.status(201).json({ 
            message: 'Admin registration successful', 
            admin: { id: result.insertedId, email: newAdmin.email, name: newAdmin.name }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to register admin' });
    }
});

// Check if admin email exists
app.post('/api/admin/check-email', async (req, res) => {
    try {
        const { email } = req.body;
        const existing = await db.collection('admin_users').findOne({ email });
        res.json({ exists: !!existing });
    } catch (error) {
        res.status(500).json({ error: 'Failed to check email' });
    }
});

// Admin login (with rate limiting)
app.post('/api/admin/login', requireDB, authLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const admin = await db.collection('admin_users').findOne({ email });
        if (!admin || admin.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful', admin: { id: admin._id, email: admin.email, name: admin.name }});
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Dashboard stats
app.get('/api/admin/stats', requireDB, async (req, res) => {
    try {
        const [totalQuizzes, totalRegistrations, activeQuizzes, recentRegistrations] = await Promise.all([
            db.collection('quizzes').countDocuments(),
            db.collection('registrations').countDocuments(),
            db.collection('quizzes').countDocuments({ status: 'Active' }),
            db.collection('registrations').find().sort({ registeredAt: -1 }).limit(5).toArray()
        ]);
        res.json({ totalQuizzes, totalRegistrations, activeQuizzes, recentRegistrations });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// Seed database
app.post('/api/seed', requireDB, async (req, res) => {
    try {
        const count = await db.collection('quizzes').countDocuments();
        if (count > 0) return res.json({ message: 'Database already seeded' });
        
        const quizzes = [
            { title: "HTML Fundamentals", description: "Test your HTML knowledge", category: "Web Development", difficulty: "Beginner", duration: 30, totalQuestions: 15, passingScore: 60, startDate: new Date().toISOString(), status: "Active", createdAt: new Date(), updatedAt: new Date() },
            { title: "JavaScript ES6+", description: "Modern JavaScript features", category: "Programming", difficulty: "Intermediate", duration: 45, totalQuestions: 20, passingScore: 70, startDate: new Date().toISOString(), status: "Active", createdAt: new Date(), updatedAt: new Date() },
            { title: "CSS Grid & Flexbox", description: "Advanced CSS layouts", category: "Web Development", difficulty: "Intermediate", duration: 40, totalQuestions: 18, passingScore: 65, startDate: new Date().toISOString(), status: "Active", createdAt: new Date(), updatedAt: new Date() },
            { title: "React.js Basics", description: "React components and hooks", category: "Web Development", difficulty: "Beginner", duration: 50, totalQuestions: 25, passingScore: 60, startDate: new Date().toISOString(), status: "Active", createdAt: new Date(), updatedAt: new Date() },
            { title: "Python Programming", description: "Python from basics to advanced", category: "Programming", difficulty: "Advanced", duration: 60, totalQuestions: 30, passingScore: 75, startDate: new Date().toISOString(), status: "Active", createdAt: new Date(), updatedAt: new Date() },
            { title: "MongoDB Essentials", description: "NoSQL database concepts", category: "Database", difficulty: "Intermediate", duration: 45, totalQuestions: 20, passingScore: 70, startDate: new Date().toISOString(), status: "Active", createdAt: new Date(), updatedAt: new Date() },
            { title: "Node.js & Express", description: "Backend development", category: "Programming", difficulty: "Intermediate", duration: 50, totalQuestions: 22, passingScore: 65, startDate: new Date().toISOString(), status: "Active", createdAt: new Date(), updatedAt: new Date() },
            { title: "UI/UX Design", description: "Design principles", category: "Design", difficulty: "Beginner", duration: 40, totalQuestions: 20, passingScore: 60, startDate: new Date().toISOString(), status: "Active", createdAt: new Date(), updatedAt: new Date() },
            { title: "Data Structures", description: "DS&A for interviews", category: "Programming", difficulty: "Advanced", duration: 90, totalQuestions: 35, passingScore: 80, startDate: new Date().toISOString(), status: "Active", createdAt: new Date(), updatedAt: new Date() },
            { title: "Git & GitHub", description: "Version control basics", category: "Programming", difficulty: "Beginner", duration: 30, totalQuestions: 15, passingScore: 60, startDate: new Date().toISOString(), status: "Active", createdAt: new Date(), updatedAt: new Date() },
            { title: "SQL Database", description: "Advanced SQL queries", category: "Database", difficulty: "Advanced", duration: 60, totalQuestions: 25, passingScore: 75, startDate: new Date().toISOString(), status: "Active", createdAt: new Date(), updatedAt: new Date() },
            { title: "Machine Learning", description: "ML concepts and algorithms", category: "Data Science", difficulty: "Intermediate", duration: 75, totalQuestions: 30, passingScore: 70, startDate: new Date().toISOString(), status: "Active", createdAt: new Date(), updatedAt: new Date() }
        ];
        
        await db.collection('quizzes').insertMany(quizzes);
        await db.collection('admin_users').insertOne({
            name: "Admin",
            email: process.env.ADMIN_EMAIL || "admin@quizmaster.com",
            password: process.env.ADMIN_PASSWORD || "admin123",
            role: "admin",
            createdAt: new Date()
        });
        
        res.json({ message: 'Database seeded successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to seed database' });
    }
});

app.get('/', (req, res) => res.sendFile(__dirname + '/index.html'));

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        error: isProduction ? 'Internal server error' : err.message 
    });
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════╗
║   🚀 QuizMaster Server Running!      ║
╠═══════════════════════════════════════╣
║   📍 Port: ${PORT}                      ║
║   🌐 Environment: ${NODE_ENV}          ║
║   📊 Database: MongoDB Atlas          ║
╚═══════════════════════════════════════╝
    `);
    if (!isProduction) {
        console.log(`   🌐 URL: http://localhost:${PORT}`);
    }
});

// Graceful shutdown
const gracefulShutdown = async (signal) => {
    console.log(`\n${signal} received. Starting graceful shutdown...`);
    
    server.close(async () => {
        console.log('HTTP server closed');
        
        if (mongoClient) {
            try {
                await mongoClient.close();
                console.log('MongoDB connection closed');
            } catch (error) {
                console.error('Error closing MongoDB connection:', error);
            }
        }
        
        console.log('🔴 Shutdown complete');
        process.exit(0);
    });
    
    // Force close after 10 seconds
    setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions - exit immediately
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    console.error('🔴 Fatal error - exiting immediately');
    process.exit(1);
});

// Handle unhandled promise rejections - exit immediately
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    console.error('🔴 Fatal error - exiting immediately');
    process.exit(1);
});
