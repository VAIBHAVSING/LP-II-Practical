// QuizMaster Backend Server with MongoDB Atlas
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
let db;
const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'quizmaster';

// Connect to MongoDB Atlas
async function connectDB() {
    try {
        const client = await MongoClient.connect(mongoUri, { 
            useNewUrlParser: true, 
            useUnifiedTopology: true 
        });
        console.log('✅ Connected to MongoDB Atlas');
        db = client.db(dbName);
        
        // Create indexes for better performance
        await db.collection('quizzes').createIndex({ title: 'text', description: 'text' });
        await db.collection('registrations').createIndex({ email: 1 });
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        console.log('⚠️  Make sure to set MONGODB_URI in .env file');
        process.exit(1);
    }
}

connectDB();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Server is running',
        database: db ? 'Connected' : 'Disconnected'
    });
});

// Get all quizzes
app.get('/api/quizzes', async (req, res) => {
    try {
        const quizzes = await db.collection('quizzes').find().sort({ createdAt: -1 }).toArray();
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch quizzes' });
    }
});

// Get single quiz
app.get('/api/quizzes/:id', async (req, res) => {
    try {
        const quiz = await db.collection('quizzes').findOne({ _id: new ObjectId(req.params.id) });
        if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
        res.json(quiz);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch quiz' });
    }
});

// Create quiz
app.post('/api/quizzes', async (req, res) => {
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
app.put('/api/quizzes/:id', async (req, res) => {
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
app.delete('/api/quizzes/:id', async (req, res) => {
    try {
        const result = await db.collection('quizzes').deleteOne({ _id: new ObjectId(req.params.id) });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Quiz not found' });
        res.json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete quiz' });
    }
});

// Register for quiz
app.post('/api/register', async (req, res) => {
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

// Admin login
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await db.collection('admin_users').findOne({ email });
        if (!admin || admin.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        res.json({ message: 'Login successful', admin: { id: admin._id, email: admin.email, name: admin.name }});
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Dashboard stats
app.get('/api/admin/stats', async (req, res) => {
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
app.post('/api/seed', async (req, res) => {
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

app.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════╗
║   🚀 QuizMaster Server Running!      ║
╠═══════════════════════════════════════╣
║   📍 Port: ${PORT}                      ║
║   🌐 URL: http://localhost:${PORT}      ║
║   📊 Database: MongoDB Atlas          ║
╚═══════════════════════════════════════╝
    `);
});

process.on('SIGINT', () => { console.log('\n🔴 Shutting down...'); process.exit(0); });
