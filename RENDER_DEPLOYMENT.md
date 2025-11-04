# 🚀 Deploy QuizMaster to Render

This guide will walk you through deploying the QuizMaster application to Render's free tier.

## Prerequisites

Before you begin, make sure you have:
- ✅ A [GitHub](https://github.com) account
- ✅ A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier)
- ✅ A [Render](https://render.com) account (free tier)

## Step 1: Prepare MongoDB Atlas

### 1.1 Create MongoDB Cluster
1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster (free M0 tier is sufficient)
3. Wait for cluster creation (usually 3-5 minutes)

### 1.2 Configure Database Access
1. Go to **Database Access** in the left sidebar
2. Click **Add New Database User**
3. Create a user with username and password (save these!)
4. Grant **Read and write to any database** permissions
5. Click **Add User**

### 1.3 Configure Network Access
1. Go to **Network Access** in the left sidebar
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
   - This is required for Render to connect
4. Click **Confirm**

### 1.4 Get Connection String
1. Go to **Database** in the left sidebar
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your database user password
6. Save this connection string for later

Example:
```
mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Step 2: Prepare Your GitHub Repository

### 2.1 Push Your Code
Make sure all your code is committed and pushed to GitHub:

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 2.2 Verify Files
Ensure these files exist in your repository:
- ✅ `server.js` - Main server file
- ✅ `package.json` - Dependencies and scripts
- ✅ `render.yaml` - Render configuration (optional but recommended)
- ✅ `.env.example` - Environment variables template

## Step 3: Deploy to Render

### 3.1 Create New Web Service
1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **New +** button
3. Select **Web Service**

### 3.2 Connect Repository
1. Click **Connect account** to connect your GitHub
2. Select your repository: `LP-II-Practical` or `QuizMaster-App`
3. Click **Connect**

### 3.3 Configure Web Service

Fill in the following details:

**Basic Settings:**
- **Name**: `quizmaster-app` (or your preferred name)
- **Region**: Choose closest to your users (e.g., Oregon, Frankfurt)
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (use root)
- **Runtime**: `Node`

**Build & Deploy Settings:**
- **Build Command**: `npm install`
- **Start Command**: `npm start`

**Instance Type:**
- Select **Free** tier

### 3.4 Add Environment Variables

Click **Add Environment Variable** and add the following:

| Key | Value | Notes |
|-----|-------|-------|
| `MONGODB_URI` | Your MongoDB connection string | From Step 1.4 |
| `DB_NAME` | `quizmaster` | Database name |
| `NODE_ENV` | `production` | Environment mode |
| `ADMIN_EMAIL` | `admin@quizmaster.com` | Change if desired |
| `ADMIN_PASSWORD` | Your secure password | ⚠️ Change default! |

**Important:** 
- Click the eye icon to keep sensitive values like `MONGODB_URI` and `ADMIN_PASSWORD` hidden
- Make sure `MONGODB_URI` includes the correct password

Example environment variables:
```env
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
DB_NAME=quizmaster
NODE_ENV=production
ADMIN_EMAIL=admin@quizmaster.com
ADMIN_PASSWORD=YourSecurePassword123!
```

### 3.5 Deploy
1. Review all settings
2. Click **Create Web Service**
3. Wait for the deployment to complete (3-5 minutes)

## Step 4: Verify Deployment

### 4.1 Check Deployment Status
1. Watch the deployment logs in real-time
2. Look for these success messages:
   ```
   ✅ Connected to MongoDB Atlas
   🚀 QuizMaster Server Running!
   ```

### 4.2 Test Your Application
Once deployed, Render will provide you with a URL like:
```
https://quizmaster-app.onrender.com
```

**Test these endpoints:**

1. **Home Page**
   ```
   https://your-app-name.onrender.com
   ```

2. **Health Check**
   ```
   https://your-app-name.onrender.com/api/health
   ```
   Should return: `{"status":"OK","message":"Server is running","database":"Connected"}`

3. **API Endpoints**
   ```
   https://your-app-name.onrender.com/api/quizzes
   ```

### 4.3 Seed Database (First Time Only)
To populate your database with sample quizzes:

```bash
curl -X POST https://your-app-name.onrender.com/api/seed
```

Or visit the URL in your browser to trigger seeding.

## Step 5: Access Your Application

### Admin Access
1. Navigate to: `https://your-app-name.onrender.com/admin/login.html`
2. Login with:
   - Email: Your `ADMIN_EMAIL` from environment variables
   - Password: Your `ADMIN_PASSWORD` from environment variables
3. Start managing quizzes!

### Student Access
1. Navigate to: `https://your-app-name.onrender.com/student-register.html`
2. Create a student account
3. Login at: `https://your-app-name.onrender.com/student-login.html`

## Step 6: Configure Custom Domain (Optional)

### 6.1 Add Custom Domain
1. In Render dashboard, go to your service
2. Click **Settings** tab
3. Scroll to **Custom Domains**
4. Click **Add Custom Domain**
5. Enter your domain (e.g., `quizmaster.yourdomain.com`)

### 6.2 Configure DNS
Add a CNAME record in your DNS provider:
```
Type: CNAME
Name: quizmaster (or your subdomain)
Value: your-app-name.onrender.com
```

### 6.3 Enable HTTPS
Render automatically provisions SSL certificates for custom domains.

## Troubleshooting

### Issue: "Cannot connect to MongoDB"

**Solution:**
1. Verify `MONGODB_URI` is correct in Render environment variables
2. Check MongoDB Atlas Network Access allows 0.0.0.0/0
3. Ensure MongoDB user has correct permissions
4. Verify password doesn't contain special characters that need URL encoding

### Issue: "Application Error" or 503

**Solution:**
1. Check Render logs for errors
2. Verify all environment variables are set
3. Make sure `NODE_ENV=production` is set
4. Check if build completed successfully

### Issue: "Rate limit exceeded"

**Solution:**
- The app has rate limiting enabled (100 requests per 15 minutes)
- For higher limits, upgrade your Render plan
- Or modify rate limits in `server.js`

### Issue: Service keeps sleeping

**Solution:**
- Free tier on Render spins down after 15 minutes of inactivity
- First request after sleep takes 30-50 seconds
- Consider upgrading to paid tier for always-on service
- Or use a service like UptimeRobot to ping your app every 14 minutes

### Issue: API calls fail with CORS errors

**Solution:**
- The app is configured to allow all origins in production
- Check browser console for specific error
- Verify `config.js` is using dynamic BASE_URL

## Performance Optimization Tips

### 1. Keep Service Awake (Free Tier)
Use a service like [UptimeRobot](https://uptimerobot.com) to ping your app:
- Endpoint: `https://your-app-name.onrender.com/api/health`
- Interval: Every 14 minutes

### 2. Monitor Your App
1. In Render dashboard, check **Metrics** tab
2. Monitor CPU, Memory, and Request rates
3. Set up alerts for downtime

### 3. Database Indexing
The app automatically creates indexes on:
- Quiz titles and descriptions (text search)
- User emails (unique lookups)
- Registration emails (fast queries)

### 4. Optimize MongoDB
1. Monitor Atlas metrics
2. Use connection pooling (already configured)
3. Consider upgrading MongoDB tier for better performance

## Security Best Practices

### 1. Change Default Credentials
⚠️ **IMPORTANT:** Change the default admin password:
- Update `ADMIN_PASSWORD` in Render environment variables
- Or create a new admin user and delete the default one

### 2. Use Strong Passwords
Generate a secure password:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Monitor Access
- Check Render logs regularly
- Monitor MongoDB Atlas access logs
- Set up alerts for suspicious activity

### 4. Keep Dependencies Updated
```bash
npm audit
npm update
```

## Updating Your Application

### Auto-Deploy (Recommended)
1. Render automatically deploys when you push to GitHub
2. Enable in Render: Settings → Build & Deploy → Auto-Deploy: Yes

### Manual Deploy
1. Go to Render dashboard
2. Click **Manual Deploy** → **Deploy latest commit**

### View Deploy History
- Check **Events** tab in Render dashboard
- View logs for each deployment

## Cost Breakdown

### Free Tier Includes:
- ✅ 750 hours/month of runtime
- ✅ Automatic HTTPS
- ✅ Continuous deployment from Git
- ✅ Unlimited collaborators
- ✅ Built-in metrics and logging

### Limitations:
- ⚠️ Service spins down after 15 minutes of inactivity
- ⚠️ 512 MB RAM
- ⚠️ Shared CPU
- ⚠️ No custom logs retention

### Upgrade Options:
- **Starter**: $7/month - Always on, 512 MB RAM
- **Standard**: $25/month - 2 GB RAM, more CPU
- **Pro**: Custom pricing - Dedicated resources

## Support Resources

### Documentation
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com)
- [QuizMaster GitHub](https://github.com/yourusername/LP-II-Practical)

### Getting Help
1. Check Render community forum
2. Review deployment logs
3. Open an issue on GitHub
4. Contact Render support (paid plans)

## Next Steps

After successful deployment:
1. ✅ Test all features thoroughly
2. ✅ Change default admin password
3. ✅ Set up UptimeRobot to keep service awake
4. ✅ Share your app URL with users
5. ✅ Monitor performance and logs
6. ✅ Consider adding custom domain

---

## Quick Reference

### Important URLs
```
Application:     https://your-app-name.onrender.com
Admin Portal:    https://your-app-name.onrender.com/admin/login.html
Student Portal:  https://your-app-name.onrender.com/student-login.html
API Health:      https://your-app-name.onrender.com/api/health
Render Dashboard: https://dashboard.render.com
```

### Key Commands
```bash
# Seed database
curl -X POST https://your-app-name.onrender.com/api/seed

# Test API
curl https://your-app-name.onrender.com/api/health
curl https://your-app-name.onrender.com/api/quizzes

# View logs (Render CLI)
render logs -s your-app-name
```

---

**🎉 Congratulations!** Your QuizMaster application is now live on Render!

For questions or issues, please check the troubleshooting section or open an issue on GitHub.
