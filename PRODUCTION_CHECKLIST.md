# 🚀 Production Deployment Checklist

Use this checklist to ensure your QuizMaster application is production-ready before deployment.

## Pre-Deployment Checklist

### 1. Environment Configuration ✅
- [ ] MongoDB Atlas cluster is created and configured
- [ ] Database user is created with appropriate permissions
- [ ] Network access is configured (0.0.0.0/0 for cloud deployments)
- [ ] Connection string is obtained and tested
- [ ] All environment variables are documented

### 2. Security Configuration ✅
- [ ] Change `ADMIN_EMAIL` from default value
- [ ] Change `ADMIN_PASSWORD` to a strong, unique password
- [ ] MongoDB password is strong (16+ characters, mixed case, numbers, symbols)
- [ ] `NODE_ENV` is set to `production`
- [ ] All secrets are stored in environment variables (not in code)
- [ ] No API keys or credentials in Git repository

### 3. Code Quality ✅
- [ ] All features tested locally
- [ ] No console.error or debugging code left in production
- [ ] All dependencies are up to date (`npm audit`)
- [ ] No known vulnerabilities (`npm audit fix`)
- [ ] .gitignore excludes node_modules, .env, and build artifacts

### 4. Database Configuration ✅
- [ ] MongoDB Atlas is in production mode
- [ ] Database backups are enabled
- [ ] Indexes are created (automatic on first connection)
- [ ] Connection pooling is configured (already done)

### 5. Application Features ✅
- [ ] Health check endpoint works: `/api/health`
- [ ] All API endpoints tested
- [ ] Admin login/registration works
- [ ] Student login/registration works
- [ ] Quiz CRUD operations work
- [ ] Registration functionality works
- [ ] Theme toggle works (light/dark mode)
- [ ] Search and filters work

## Deployment Platform Checklist

### Render Deployment
- [ ] GitHub repository is public or connected to Render
- [ ] `render.yaml` exists in repository (already included)
- [ ] Environment variables are configured in Render dashboard:
  - `MONGODB_URI`
  - `DB_NAME`
  - `NODE_ENV=production`
  - `ADMIN_EMAIL`
  - `ADMIN_PASSWORD`
- [ ] Build command is set: `npm install`
- [ ] Start command is set: `npm start`
- [ ] Health check path is set: `/api/health`
- [ ] Auto-deploy is enabled

### Other Platforms (Heroku, Vercel, Railway)
- [ ] Environment variables configured in platform dashboard
- [ ] Build and start commands configured
- [ ] Database connection string is correct
- [ ] Platform-specific configuration is complete

## Post-Deployment Checklist

### 1. Verify Deployment ✅
- [ ] Application is accessible via provided URL
- [ ] Health check returns `{"status":"OK","database":"Connected"}`
- [ ] Home page loads correctly
- [ ] All static assets (CSS, JS, images) load
- [ ] No 404 errors in browser console
- [ ] No CORS errors in browser console

### 2. Test Core Functionality ✅
- [ ] Admin can login at `/admin/login.html`
- [ ] Admin can create new quizzes
- [ ] Admin can view dashboard statistics
- [ ] Students can register at `/student-register.html`
- [ ] Students can login at `/student-login.html`
- [ ] Students can view quiz listing
- [ ] Students can register for quizzes
- [ ] Search functionality works
- [ ] Filters work (category, difficulty)

### 3. Seed Database (First Time) ✅
- [ ] Run seed endpoint: `POST /api/seed`
  ```bash
  curl -X POST https://your-app-name.onrender.com/api/seed
  ```
- [ ] Verify sample quizzes are created
- [ ] Verify admin user is created
- [ ] Test login with seeded admin credentials

### 4. Performance Verification ✅
- [ ] Page load time is acceptable (< 3 seconds)
- [ ] API responses are fast (< 1 second)
- [ ] Images and assets load quickly
- [ ] No memory leaks (monitor for 24 hours)
- [ ] Database queries are efficient

### 5. Security Verification ✅
- [ ] HTTPS is enabled (automatic on most platforms)
- [ ] Security headers are present (check with securityheaders.com)
- [ ] Rate limiting is active (test with multiple rapid requests)
- [ ] Input sanitization works (test with special characters)
- [ ] Admin credentials cannot be default values
- [ ] MongoDB connection uses authentication

### 6. Monitoring Setup ✅
- [ ] Uptime monitoring configured (UptimeRobot, Pingdom, etc.)
- [ ] Error tracking configured (optional: Sentry, LogRocket)
- [ ] Log monitoring is set up (check platform logs)
- [ ] MongoDB Atlas monitoring is enabled
- [ ] Alert notifications configured

## Production Maintenance

### Daily Checks
- [ ] Check uptime monitor status
- [ ] Review error logs (if any)
- [ ] Monitor MongoDB Atlas usage

### Weekly Checks
- [ ] Review application performance metrics
- [ ] Check for failed API requests
- [ ] Verify database backup status
- [ ] Review security alerts

### Monthly Checks
- [ ] Update dependencies: `npm update`
- [ ] Run security audit: `npm audit`
- [ ] Review and optimize database indexes
- [ ] Check for new platform features or updates
- [ ] Review user feedback and issues

## Troubleshooting Guide

### Application Won't Start
1. Check environment variables are set correctly
2. Verify MongoDB connection string is valid
3. Check platform logs for specific errors
4. Ensure Node.js version is compatible (18+)

### Database Connection Errors
1. Verify MongoDB Atlas is running
2. Check network access settings (0.0.0.0/0)
3. Confirm database user credentials
4. Test connection string locally first

### Slow Performance
1. Check MongoDB Atlas metrics
2. Verify connection pooling is working
3. Review database indexes
4. Check for large response payloads
5. Consider upgrading platform tier

### 502/503 Errors
1. Check if application crashed (review logs)
2. Verify MongoDB connection is stable
3. Check memory usage limits
4. Review recent code changes

## Environment Variables Reference

Required environment variables for production:

```env
# MongoDB Atlas Connection (REQUIRED)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# Database Name
DB_NAME=quizmaster

# Environment Mode (REQUIRED for production)
NODE_ENV=production

# Port (usually auto-set by platform)
PORT=10000

# Admin Credentials (CHANGE THESE!)
ADMIN_EMAIL=your-admin@example.com
ADMIN_PASSWORD=YourStrongPasswordHere123!
```

## Quick Commands

### Test Health Endpoint
```bash
curl https://your-app-name.onrender.com/api/health
```

### Seed Database
```bash
curl -X POST https://your-app-name.onrender.com/api/seed
```

### Test API Endpoint
```bash
curl https://your-app-name.onrender.com/api/quizzes
```

### Test Admin Login
```bash
curl -X POST https://your-app-name.onrender.com/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@quizmaster.com","password":"admin123"}'
```

## Success Criteria

Your deployment is successful when:
- ✅ Application is accessible via HTTPS
- ✅ Health check returns connected database status
- ✅ All pages load without errors
- ✅ Admin and student login work
- ✅ Quiz creation and management work
- ✅ No errors in browser console
- ✅ API responses are fast (< 1 second)
- ✅ Uptime monitoring is active
- ✅ Database backups are configured

## Resources

- [Render Deployment Guide](./RENDER_DEPLOYMENT.md)
- [General Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Render Documentation](https://render.com/docs)

---

**Ready to deploy?** Follow the [Render Deployment Guide](./RENDER_DEPLOYMENT.md) for step-by-step instructions!
