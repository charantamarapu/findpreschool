# 🚀 FindPreschool.org Deployment Guide

Complete guide to deploy your full-stack preschool comparison platform to production.

---

## 📋 Pre-Deployment Checklist

- [ ] MySQL database migrated to production server
- [ ] All API endpoints tested and working
- [ ] Environment variables configured
- [ ] Frontend API endpoints point to production server
- [ ] SSL certificate obtained (if using HTTPS)
- [ ] Domain name configured with DNS

---

## 🌐 Deployment Platform Options

### Option 1: **Heroku** (Easiest for beginners)
**Cost**: Free tier (limited), Paid tiers from $7/month  
**Best for**: Quick deployment, no DevOps experience  
**Pros**: Simple deployment, built-in CI/CD, free tier available  
**Cons**: Dynos sleep on free tier, performance limitations  

### Option 2: **Railway.app** (Modern, Simple)
**Cost**: Pay-as-you-go (~$5-20/month for both frontend + backend)  
**Best for**: Small to medium projects  
**Pros**: GitHub integration, easy scaling, good pricing  
**Cons**: Newer platform, smaller community  

### Option 3: **Render.com** (Recommended)
**Cost**: Free tier available, Paid tiers from $7/month  
**Best for**: Full-stack apps, reliable free tier  
**Pros**: Free static site hosting, simple deployment, good performance  
**Cons**: Free web service goes to sleep after 15 min inactivity  

### Option 4: **DigitalOcean** (Most Control)
**Cost**: $5/month minimum  
**Best for**: Production apps, full control needed  
**Pros**: More control, better performance, affordability  
**Cons**: Requires more setup, basic DevOps knowledge  

### Option 5: **AWS** (Enterprise)
**Cost**: Varies, free tier for 12 months (some services)  
**Best for**: Large-scale applications  
**Pros**: Powerful, scalable, many services  
**Cons**: Complex setup, steeper learning curve  

---

## 🎯 RECOMMENDED: Deploy on Render.com

We recommend **Render.com** for this project because:
- Free tier available (no credit card required initially)
- Simple GitHub deployment
- Built-in MySQL database support
- Easy environment variable management
- Excellent for full-stack applications

---

## 📖 Step-by-Step Deployment on Render.com

### Step 1: Prepare Your Repository

Push your code to GitHub:

```bash
git init
git add .
git commit -m "Initial commit: FindPreschool app"
git branch -M main
git remote add origin https://github.com/charantamarapu/findpreschool.git
git push -u origin main
```

**Note**: If you get "remote origin already exists", run:
```bash
git remote set-url origin https://github.com/charantamarapu/findpreschool.git
git push -u origin main
```

### Step 2: Set Up Database

1. **Create MySQL Database** on Render:
   - Go to [render.com](https://render.com)
   - Click "New" → "MySQL"
   - Fill in details:
     - Name: `findpreschool-db`
     - Database: `findpreschool`
     - Keep default port: 3306
   - Create and note your connection string

2. **Import Schema**:
   ```bash
   mysql -h YOUR_RENDER_HOST -u YOUR_USER -p YOUR_PASSWORD < database.sql
   ```

### Step 3: Deploy Backend API

1. **Create New Service**:
   - Go to "New" → "Web Service"
   - Connect your GitHub repository
   - Select the `server` directory (if available)

2. **Configure**:
   - **Name**: `findpreschool-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

3. **Set Environment Variables**:
   Click "Environment" and add:
   ```
   NODE_ENV=production
   DB_HOST=your_render_mysql_host
   DB_USER=your_render_user
   DB_PASSWORD=your_render_password
   DB_NAME=findpreschool
   DB_PORT=3306
   PORT=10000
   CORS_ORIGIN=https://your-frontend-url.com
   JWT_SECRET=your_very_secure_random_string_here
   GOOGLE_MAPS_API_KEY=your_google_maps_key
   ```

4. **Deploy**: Click "Deploy"

5. **Note your backend URL**: `https://findpreschool-api.onrender.com`

### Step 4: Deploy Frontend

1. **Create New Service**:
   - Go to "New" → "Static Site"
   - Connect your GitHub repository

2. **Configure**:
   - **Name**: `findpreschool`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/dist`

3. **Environment Variables** (if needed):
   - Click "Environment Variables"
   - Add any frontend env vars (usually not needed)

4. **Deploy**: Click "Deploy"

5. **Note your frontend URL**: `https://findpreschool.onrender.com`

### Step 5: Update Frontend API Configuration

Edit [client/src/services/apiService.js](client/src/services/apiService.js):

```javascript
// Change from localhost to production API
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://findpreschool-api.onrender.com' 
  : 'http://localhost:5000';
```

### Step 6: Update Backend CORS

Edit [server/server.js](server/server.js):

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
```

### Step 7: Redeploy

Push your changes:
```bash
git add .
git commit -m "Update API endpoints for production"
git push origin main
```

Both services will redeploy automatically.

---

## 📦 Alternative: Deploy with Railway.app

### Quick Setup (5 minutes)

1. **Push to GitHub**
2. Go to [railway.app](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect `package.json` files

### Configure Backend

1. Click "Backend" service
2. Add Variables:
   - `NODE_ENV`: `production`
   - `DB_*`: Your database credentials
   - `JWT_SECRET`: Random secure string
   - `GOOGLE_MAPS_API_KEY`: Your API key

### Configure MySQL

1. Click "New" → Add MySQL
2. Railway creates database automatically
3. Import schema: 
   ```bash
   mysql -h HOST -u USER -p PASSWORD < database.sql
   ```

### Configure Frontend

1. Railway auto-detects `build` script
2. Set as "Static" if available
3. Your app is live!

---

## 🐳 Alternative: Docker Deployment

For more control, containerize your app:

### Create [Dockerfile](Dockerfile) (in root):

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy backend
COPY server/package.json server/
RUN cd server && npm install --production

# Copy frontend
COPY client/package.json client/
RUN cd client && npm install && npm run build

# Copy source
COPY server server/
COPY client/dist client/dist

EXPOSE 5000

CMD ["node", "server/server.js"]
```

### Deploy Docker to:
- **Google Cloud Run** (auto-scaling, free tier)
- **AWS ECS** (managed container orchestration)
- **DigitalOcean App Platform** ($12/month)
- **Heroku** (supports Docker)

---

## 🛠️ DigitalOcean Deployment (Advanced)

### 1. Create Droplet
- 2GB RAM / 2 vCPU minimum
- Ubuntu 22.04
- Cost: $12/month

### 2. SSH into Server
```bash
ssh root@YOUR_DROPLET_IP
```

### 3. Install Dependencies
```bash
apt update && apt upgrade -y
apt install nodejs npm mysql-server curl -y
```

### 4. Clone Repository
```bash
cd /var/www
git clone https://github.com/charantamarapu/findpreschool.git
cd findpreschool
```

### 5. Setup Backend
```bash
cd server
cp .env.example .env
# Edit .env with production values
npm install
npm start
```

### 6. Setup Frontend
```bash
cd ../client
npm install
npm run build
# Copy dist folder to web server (nginx)
```

### 7. Setup Nginx Reverse Proxy
```bash
apt install nginx -y
```

Create `/etc/nginx/sites-available/findpreschool`:
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # Frontend
    location / {
        root /var/www/findpreschool/client/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/findpreschool /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 8. Setup SSL with Let's Encrypt
```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com
```

---

## 🔒 Production Security Checklist

- [ ] Use HTTPS/SSL everywhere
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets (32+ characters)
- [ ] Enable CORS only for your domain
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting on API
- [ ] Set up database backups
- [ ] Configure error logging (Sentry, LogRocket)
- [ ] Add monitoring (New Relic, Datadog)
- [ ] Use helmet middleware (already in your code)

---

## 📊 Environment Variables Reference

### Backend (.env)
```
NODE_ENV=production
DB_HOST=your-db-host
DB_USER=your-user
DB_PASSWORD=your-password
DB_NAME=findpreschool
DB_PORT=3306
PORT=5000
JWT_SECRET=your-very-secure-random-string-min-32-chars
CORS_ORIGIN=https://yourdomain.com
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### Frontend (.env)
```
VITE_API_URL=https://your-api-domain.com
```

---

## 🧪 Testing Your Deployment

1. **Frontend**: Visit `https://yourdomain.com` - should load app
2. **API Health**: Visit `https://api.yourdomain.com/api/health` - should return OK
3. **Preschools API**: Visit `https://api.yourdomain.com/api/preschools?city=bangalore` - should return data
4. **Database**: Check if data loads in frontend

---

## 🆘 Troubleshooting

### Issue: "Cannot connect to database"
- Verify database credentials in .env
- Check if MySQL service is running
- Ensure database firewall allows your IP

### Issue: "CORS error"
- Update `CORS_ORIGIN` in backend .env
- Ensure frontend URL matches exactly

### Issue: "Frontend is blank/404"
- Check build command ran successfully
- Verify frontend API URL points to backend
- Check browser console for errors

### Issue: "Frontend can't reach API"
- Verify backend is running: `curl https://api-url.com/api/health`
- Check CORS headers in response
- Ensure frontend sends requests to correct URL

---

## 📈 Performance Optimization

1. **Frontend**:
   - Vite already handles code splitting
   - Images: Compress and optimize
   - Enable gzip in server

2. **Backend**:
   - Enable query caching
   - Add database indexes
   - Implement pagination (done in controllers)
   - Use CDN for static assets

3. **Database**:
   - Regular backups
   - Optimize slow queries
   - Archive old comparison history

---

## 🎯 Next Steps

1. **Choose your platform** (we recommend Render.com)
2. **Follow the step-by-step guide** for your platform
3. **Test all endpoints** using API_TESTING_GUIDE.md
4. **Configure domain** to point to your deployment
5. **Set up monitoring** and backups
6. **Share your app** with the world!

---

## 📞 Need Help?

- **Render Documentation**: https://render.com/docs
- **Railway Documentation**: https://docs.railway.app
- **DigitalOcean Guides**: https://www.digitalocean.com/community/tutorials
- **Node.js Best Practices**: https://nodejs.org/en/docs/guides/nodejs-performance/

---

**Happy deploying! 🎉**
