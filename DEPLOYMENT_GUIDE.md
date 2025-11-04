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

### Option 1: Render (Recommended) ⭐

**Best for:** Production deployment with free tier, automatic HTTPS, and continuous deployment.

**Quick Steps:**
1. Push code to GitHub
2. Sign up at [Render.com](https://render.com)
3. Create new Web Service
4. Connect GitHub repository
5. Configure environment variables
6. Deploy automatically!

**Features:**
- ✅ Free tier (750 hours/month)
- ✅ Automatic HTTPS/SSL
- ✅ Auto-deploy from Git
- ✅ Built-in health checks
- ✅ No credit card required

**📖 [Complete Render Deployment Guide](./RENDER_DEPLOYMENT.md)** - Step-by-step instructions with screenshots

**Configuration:**
- `render.yaml` is already included in the repository
- Config.js automatically detects production environment
- No manual BASE_URL updates needed!

### Option 2: Traditional Hosting (VPS/Dedicated Server)

1. **Set environment variables:**
   ```bash
   export MONGODB_URI="mongodb+srv://user:pass@cluster.mongodb.net"
   export PORT=3000
   export NODE_ENV=production
   ```

2. **Start server:**
   ```bash
   node server.js
   ```

3. **Use PM2 for production (recommended):**
   ```bash
   npm install -g pm2
   pm2 start server.js --name quizmaster
   pm2 save
   pm2 startup
   ```

### Option 3: Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t quizmaster .
docker run -p 3000:3000 --env-file .env quizmaster
```

### Option 4: Cloud Platforms

#### Heroku
```bash
heroku create quizmaster-app
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set NODE_ENV=production
git push heroku master
```

#### Vercel
```bash
npm install -g vercel
vercel
# Set environment variables in Vercel dashboard
```

#### Railway
- Connect GitHub repo to Railway
- Add environment variables in Railway dashboard
- Deploy automatically on push

#### AWS/Azure/GCP
- Deploy as Node.js application
- Set environment variables in platform
- Configure MongoDB connection
- Open port (default 3000, or use PORT env var)

## 🔒 Security Checklist

Before deploying to production:

**Required:**
- [ ] Change default admin credentials (ADMIN_EMAIL, ADMIN_PASSWORD)
- [ ] Set strong MongoDB password
- [ ] Set NODE_ENV=production
- [ ] Use environment variables for all secrets

**Automatically Configured (already implemented):**
- [x] HTTPS/SSL (automatic on Render, Heroku, Vercel)
- [x] CORS configured for production (auto-detects origin)
- [x] Rate limiting enabled (100 req/15min general, 5 req/15min auth)
- [x] Input sanitization (MongoDB operator injection prevention)
- [x] Security headers (Helmet middleware)
- [x] Compression enabled for performance
- [x] Graceful shutdown handling
- [x] Database connection validation

**Recommended:**
- [ ] Configure firewall rules (if using VPS)
- [ ] Enable MongoDB Atlas IP whitelist (or use 0.0.0.0/0 for cloud)
- [ ] Set up monitoring/logging service
- [ ] Configure backup strategy for MongoDB
- [ ] Review and test all API endpoints
- [ ] Set up uptime monitoring (e.g., UptimeRobot)

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

## 📊 Performance Optimizations

**Already Implemented (Production-Ready):**

1. **✅ Response Compression**
   - Automatic gzip compression for all responses
   - Reduces bandwidth usage by 60-80%
   - Improves page load times

2. **✅ Static File Caching**
   - 1-day cache for static assets in production
   - ETags for efficient cache validation
   - Reduces server load and improves response times

3. **✅ MongoDB Connection Pooling**
   - Pool size: 2-10 connections
   - Efficient connection reuse
   - Reduced latency for database queries

4. **✅ Database Indexes**
   - Text indexes on quiz titles/descriptions
   - Unique indexes on user emails
   - Faster query performance

5. **✅ Rate Limiting**
   - Prevents abuse and DoS attacks
   - Protects server resources
   - 100 requests/15min for general API
   - 5 attempts/15min for authentication

**Additional Recommendations:**

- Use CDN for static assets (if scaling)
- Enable MongoDB Atlas auto-scaling
- Monitor with Render metrics dashboard
- Use UptimeRobot to prevent free tier sleep (Render)

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
