# 🚀 QuizMaster Deployment Guide

## ⚠️ IMPORTANT: Access Through Port 3000

The QuizMaster application **must** be accessed through the Node.js server on **port 3000**, not directly through file system or Live Server (port 5500).

### Why?

All API calls are configured to communicate with the backend server at `http://localhost:3000`. Opening HTML files directly or through a different port will cause API calls to fail.

## 🏃 Quick Start

### 1. Start MongoDB

```bash
# Start MongoDB service
mongod

# Or if using MongoDB as a service (Linux/Mac)
sudo systemctl start mongod

# Or if using Homebrew (Mac)
brew services start mongodb-community
```

### 2. Start the Server

```bash
# Navigate to project directory
cd Quiz-app

# Start the Node.js server
node server.js
```

You should see:
```
✅ Connected to MongoDB Atlas
🚀 Server running on http://localhost:3000
```

### 3. Access the Application

Open your browser and navigate to:

**Main Website:**
```
http://localhost:3000
```

**Admin Dashboard:**
```
http://localhost:3000/admin/login.html
```

**Student Portal:**
```
http://localhost:3000/student-login.html
```

## 📁 Project Structure

```
Quiz-app/
├── index.html              → Homepage (served on http://localhost:3000)
├── events.html             → Quiz listings
├── register.html           → Registration form
├── student-login.html      → Student login
├── student-register.html   → Student signup
├── student-dashboard.html  → Student dashboard
├── admin/
│   ├── login.html         → Admin login
│   ├── register.html      → Admin signup
│   └── dashboard.html     → Admin panel
├── js/
│   ├── config.js          → API configuration (BASE_URL: localhost:3000)
│   ├── admin.js           → Admin functionality
│   ├── events.js          → Quiz display
│   ├── validation.js      → Form validation
│   ├── student-auth.js    → Student authentication
│   ├── admin-auth.js      → Admin authentication
│   └── student-dashboard.js → Student dashboard logic
├── server.js              → Express backend server
└── .env                   → Environment variables
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017
DB_NAME=quizmaster

# Server Configuration
PORT=3000
NODE_ENV=development
```

### API Configuration

The `js/config.js` file contains the API base URL:

```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:3000',
    // ... endpoints
};
```

**For Production:**
Update `BASE_URL` to your production domain:
```javascript
BASE_URL: 'https://your-domain.com'
```

## 🌐 Deployment Options

### Option 1: Traditional Hosting

1. **Update config.js:**
   ```javascript
   BASE_URL: 'https://your-domain.com'
   ```

2. **Set environment variables:**
   ```bash
   export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net"
   export PORT=3000
   ```

3. **Start server:**
   ```bash
   node server.js
   ```

4. **Use PM2 for production:**
   ```bash
   npm install -g pm2
   pm2 start server.js --name quizmaster
   pm2 save
   pm2 startup
   ```

### Option 2: Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t quizmaster .
docker run -p 3000:3000 --env-file .env quizmaster
```

### Option 3: Cloud Platforms

#### Heroku
```bash
heroku create quizmaster-app
heroku config:set MONGODB_URI=your_mongodb_uri
git push heroku master
```

#### Vercel
```bash
npm install -g vercel
vercel
```

#### AWS/Azure/GCP
- Deploy as Node.js application
- Set environment variables in platform
- Configure MongoDB connection
- Open port 3000

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change default admin credentials
- [ ] Set strong MongoDB password
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for production domain
- [ ] Set NODE_ENV=production
- [ ] Enable rate limiting
- [ ] Add input sanitization
- [ ] Set up monitoring/logging
- [ ] Configure firewall rules
- [ ] Enable MongoDB authentication
- [ ] Use environment variables for secrets
- [ ] Remove console.log statements
- [ ] Set secure session cookies

## 🐛 Troubleshooting

### Issue: "Cannot GET /api/quizzes"

**Solution:** Make sure you're accessing through `http://localhost:3000`, not file:// or localhost:5500

### Issue: CORS errors

**Solution:** Check that CORS is enabled in `server.js`:
```javascript
app.use(cors());
```

For production, configure specific origins:
```javascript
app.use(cors({
    origin: 'https://your-domain.com',
    credentials: true
}));
```

### Issue: MongoDB connection failed

**Solution:**
1. Check MongoDB is running: `systemctl status mongod`
2. Verify MONGODB_URI in `.env`
3. Check network connectivity
4. Verify MongoDB credentials

### Issue: Port 3000 already in use

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

### Issue: Static files not loading

**Solution:** Ensure `express.static` is configured in `server.js`:
```javascript
app.use(express.static(__dirname));
```

## 📊 Performance Tips

1. **Enable Compression:**
   ```javascript
   const compression = require('compression');
   app.use(compression());
   ```

2. **Add Caching Headers:**
   ```javascript
   app.use(express.static(__dirname, {
       maxAge: '1d',
       etag: true
   }));
   ```

3. **Use MongoDB Indexes:**
   Already configured in `server.js`

4. **Enable Gzip:**
   Configured automatically with compression middleware

## 🔄 Development Workflow

### Local Development

1. Start MongoDB: `mongod`
2. Start server: `npm run dev` (with nodemon) or `node server.js`
3. Access: `http://localhost:3000`
4. Make changes
5. Server auto-restarts (if using nodemon)
6. Refresh browser

### Testing

```bash
# Test API endpoints
curl http://localhost:3000/api/health
curl http://localhost:3000/api/quizzes

# Test authentication
curl -X POST http://localhost:3000/api/student/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 📝 Default Credentials

### Admin Account
- Email: `admin@quizmaster.com`
- Password: `admin123`

### Test Student
- Create via registration form at: `http://localhost:3000/student-register.html`

## 🎯 Next Steps

1. ✅ Start MongoDB
2. ✅ Start Node.js server
3. ✅ Access on http://localhost:3000
4. ✅ Create admin account
5. ✅ Add quizzes
6. ✅ Test student registration
7. ✅ Deploy to production!

## 📞 Support

For issues or questions:
1. Check this deployment guide
2. Review INTEGRATION_SUMMARY.md
3. Check server logs: `tail -f server.log`
4. Review browser console for errors

---

**Remember:** Always access through **http://localhost:3000** for development and testing! 🎉
