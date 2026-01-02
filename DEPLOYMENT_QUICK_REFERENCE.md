# Quick Start Deployment Commands

## 1. Setup Render.com (Recommended)

### Generate JWT Secret
```bash
openssl rand -base64 32
```

### MySQL Connection String Format
```
mysql://user:password@host:3306/findpreschool
```

## 2. Setup Railway.app

### Same steps as Render
- Push to GitHub
- Connect repository
- Railway auto-deploys

## 3. Deploy to DigitalOcean

### SSH & Setup
```bash
ssh root@your-droplet-ip
apt update && apt upgrade -y
apt install nodejs npm mysql-server nginx certbot python3-certbot-nginx -y
```

### Clone & Setup
```bash
cd /var/www
git clone https://github.com/your-username/findpreschool.git
cd findpreschool/server
npm install
npm start
```

## 4. Docker Deployment

```bash
# Build image
docker build -t findpreschool:latest .

# Run container
docker run -d \
  -e DB_HOST=your-db-host \
  -e DB_USER=your-user \
  -e DB_PASSWORD=your-pass \
  -e DB_NAME=findpreschool \
  -e JWT_SECRET=your-secret \
  -p 5000:5000 \
  findpreschool:latest
```

## 5. Environment Variables You'll Need

Before deploying, gather:
1. **MySQL Database Host** - from your hosting provider
2. **Database User & Password** - from MySQL setup
3. **Google Maps API Key** - from Google Cloud Console
4. **JWT Secret** - generate with: `openssl rand -base64 32`
5. **Frontend Domain URL** - where your frontend will be hosted
6. **Email credentials** (optional) - for notifications

## 6. Testing After Deployment

```bash
# Test API is running
curl https://your-api-domain.com/api/health

# Test database connection
curl https://your-api-domain.com/api/preschools?city=bangalore

# Test frontend loads
# Visit https://your-domain.com in browser
```

## 7. Domain Configuration

Point your domain to:
- **Frontend**: Render static site URL or your hosting provider
- **API**: Backend service URL

Use Nginx reverse proxy for unified domain:
```nginx
location /api {
    proxy_pass http://backend-url:5000;
}

location / {
    root /path/to/frontend/dist;
    try_files $uri $uri/ /index.html;
}
```

## 8. SSL Certificate

For Render & Railway: Automatic HTTPS ✅

For DigitalOcean:
```bash
certbot --nginx -d yourdomain.com
```

## 9. Database Backup

```bash
# Backup database
mysqldump -h HOST -u USER -p DB_NAME > backup.sql

# Restore database
mysql -h HOST -u USER -p DB_NAME < backup.sql
```

## 10. Monitoring & Logs

**Render Dashboard**: Check logs in web service panel
**Railway Dashboard**: Real-time logs available
**DigitalOcean**: SSH and check `journalctl -u your-service`
