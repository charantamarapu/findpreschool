# Quick Start Guide - FindPreschool.org

## 5-Minute Setup

### 1. Database Setup
```bash
# Open MySQL
mysql -u root -p

# Import schema
source database.sql;

# Exit
exit;
```

### 2. Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your credentials
# - DB_PASSWORD: your MySQL password
# - GOOGLE_MAPS_API_KEY: your Google Maps API key

# Start server
npm run dev
# Server: http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Start frontend
npm run dev
# Frontend: http://localhost:5173
```

## 🔑 Required API Keys

### No API Keys Required! 🎉
The app now uses **OpenStreetMap** (free, open-source) instead of Google Maps. No API key setup needed!

## ✅ Verification Checklist

- [ ] MySQL running and database imported
- [ ] .env file configured in server/
- [ ] Backend starts without errors (`http://localhost:5000/api/health`)
- [ ] Frontend loads (`http://localhost:5173`)
- [ ] Can see preschools on homepage with map

## 🧪 Test APIs

```bash
# Health check
curl http://localhost:5000/api/health

# Get all preschools
curl http://localhost:5000/api/preschools

# Get preschools by city
curl "http://localhost:5000/api/preschools?city=Delhi&limit=10"
```

## 📝 First Steps

1. **Add Preschools**: Use Google Maps integration
   ```bash
   POST /api/google-maps/fetch
   {
     "location": "Delhi",
     "radius": 10000
   }
   ```

2. **View Preschools**: Visit `http://localhost:5173`

3. **Submit Reviews**: Click on preschool → Reviews tab

4. **Compare**: Select preschools and compare fees

## 🐛 Common Issues

**Port 5000/5173 already in use?**
```bash
# Find and kill process
lsof -i :5000
kill -9 <PID>
```

**Database connection failed?**
- Check MySQL is running: `mysql -u root -p`
- Verify credentials in .env
- Run `source database.sql` again

**Map not showing?**
- Check browser console for errors
- Ensure OpenStreetMap tiles are loading
- Maps require latitude/longitude in database

## 📖 Next Steps

1. Read full [README.md](./README.md)
2. Explore API endpoints
3. Customize UI in client/src/
4. Add admin authentication
5. Deploy to production

## 🎯 Development Tips

- Hot reload enabled on both frontend and backend
- Database auto-syncs with models
- Check console for detailed error messages
- Use Postman/Insomnia for API testing

---

**Ready to go! Start the servers and visit http://localhost:5173** 🚀
