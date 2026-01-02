# FindPreschool.org - Full Stack Preschool Comparison Platform

A comprehensive full-stack application for comparing preschools with verified data, parent reviews, fee transparency, and franchise information. Built with Node.js/Express, React/Vite, and MySQL.

## 🚀 Features

- **100% Verified Data**: No marketing claims, just facts verified by the team
- **Easy Comparison**: Compare up to 4 preschools side-by-side with detailed metrics
- **Fee Transparency**: View all fees upfront - monthly, annual, registration, and hidden charges
- **Parent Reviews**: Verified reviews with ratings for facilities, teachers, curriculum, and safety
- **Google Maps Integration**: Fetch preschool data from Google Maps and store in database
- **Franchise Opportunities**: Compare franchise details, royalties, and support
- **Advanced Filtering**: Filter by city, fee range, rating, facilities, and age groups
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Admin Dashboard**: Verify data, manage reviews, and update preschool information

## 📋 Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **Sequelize** ORM
- **Google Maps Places API** integration
- **JWT** for authentication
- **Joi** for validation
- **Axios** for HTTP requests

### Frontend
- **React 18** with Hooks
- **Vite** as build tool
- **React Router v6** for routing
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Lucide React** for icons

## 📁 Project Structure

```
findpreschool/
├── server/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── preschoolController.js
│   │   ├── googleMapsController.js
│   │   ├── comparisonController.js
│   │   ├── detailController.js
│   │   └── reviewController.js
│   ├── models/
│   │   ├── Preschool.js
│   │   ├── PreschoolImage.js
│   │   ├── AdmissionDetail.js
│   │   ├── FranchiseDetail.js
│   │   ├── ComparisonHistory.js
│   │   ├── Review.js
│   │   ├── AdminUser.js
│   │   ├── PreschoolOwner.js
│   │   └── index.js
│   ├── routes/
│   │   ├── preschools.js
│   │   ├── comparison.js
│   │   ├── googleMaps.js
│   │   ├── reviews.js
│   │   └── details.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PreschoolCard.jsx
│   │   │   ├── ComparisonPanel.jsx
│   │   │   ├── FilterSidebar.jsx
│   │   │   └── PreschoolDetail.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── PreschoolListPage.jsx
│   │   │   └── PreschoolDetailPageWrapper.jsx
│   │   ├── services/
│   │   │   └── apiService.js
│   │   ├── context/
│   │   │   ├── ComparisonContext.jsx
│   │   │   └── FilterContext.jsx
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── database.sql
└── README.md
```

## 🗄️ Database Schema

### Tables
1. **preschools** - Main preschool information
2. **preschool_images** - Multiple images per preschool
3. **admission_details** - Fee structure and admission criteria
4. **franchise_details** - Franchise opportunities
5. **reviews** - Verified parent reviews
6. **comparison_history** - User comparison tracking
7. **admin_users** - Admin authentication
8. **preschool_owners** - Owner verification

## 🔧 Installation & Setup

### Prerequisites
- Node.js 16+ and npm/yarn
- MySQL 8.0+
- Google Maps API Key (Places API, Geocoding API)

### Backend Setup

1. **Clone and navigate to server directory**
   ```bash
   cd server
   npm install
   ```

2. **Setup MySQL Database**
   ```bash
   mysql -u root -p
   source ../database.sql
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   ```

4. **Configure .env with your credentials**
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=findpreschool
   DB_PORT=3306
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_secret_key_change_in_production
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   CORS_ORIGIN=http://localhost:5173
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   ```
   Server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   npm install
   ```

2. **Update Google Maps API Key in index.html**
   ```html
   <script
     async
     src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_MAPS_API_KEY&libraries=places"
   ></script>
   ```

3. **Start Frontend Development Server**
   ```bash
   npm run dev
   ```
   Application will run on `http://localhost:5173`

## 📡 API Endpoints

### Preschools
- `GET /api/preschools` - Get all preschools with filters
- `GET /api/preschools/:id` - Get specific preschool details
- `POST /api/preschools` - Add new preschool (admin)
- `PUT /api/preschools/:id` - Update preschool (admin)

### Google Maps Integration
- `POST /api/google-maps/fetch` - Fetch preschools from Google Maps by location
- `GET /api/google-maps/search` - Search Google Places

### Comparison
- `POST /api/comparison/admission` - Compare admission details
- `POST /api/comparison/franchise` - Compare franchise opportunities
- `GET /api/comparison/history` - Get user comparison history

### Details
- `PUT /api/details/admission/:id` - Update admission details (admin)
- `PUT /api/details/franchise/:id` - Update franchise details (admin)
- `GET /api/details/franchise/opportunities` - Get franchise opportunities

### Reviews
- `GET /api/reviews` - Get verified reviews
- `POST /api/reviews/:id` - Submit new review
- `PUT /api/reviews/:id/verify` - Verify review (admin)
- `DELETE /api/reviews/:id/reject` - Reject review (admin)
- `GET /api/reviews/admin/pending` - Get pending reviews (admin)

## 🔑 Environment Variables

### Backend (.env)
```
# Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=findpreschool
DB_PORT=3306

# Server
PORT=5000
NODE_ENV=development

# Authentication
JWT_SECRET=your_jwt_secret_key

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# CORS
CORS_ORIGIN=http://localhost:5173
```

## 🚀 Usage

### For Users
1. Visit home page and search for preschools by city
2. Browse results with filters (fee range, rating, facilities)
3. Click on a preschool to see detailed information
4. Add up to 4 preschools to comparison panel
5. Compare fees, ratings, admission details
6. Submit verified reviews with parent details

### For Admin
1. Login with admin credentials
2. Verify new preschools and data
3. Review pending parent reviews
4. Update admission and franchise details
5. Manage preschool information

### For Preschool Owners
1. Claim your preschool
2. Verify ownership
3. Update admission details
4. Add franchise information
5. Monitor reviews

## 📊 Google Maps Integration

The system fetches preschools from Google Maps Places API using multiple keywords:
- "preschool"
- "pre-school"
- "play school"
- "nursery"
- "kindergarten"

Features:
- Automatic deduplication using `google_place_id`
- Extracts name, address, phone, website, photos
- Stores photos locally with preschool records
- Geocoding for lat/long coordinates
- Auto-extracts city, state, pincode from coordinates

## 💡 Key Features

### Fee Transparency
- Monthly, annual, and registration fees
- Hidden charges tracked as JSON
- Total annual cost calculation
- Year-wise cost projection

### Smart Comparison
- Compare up to 4 preschools
- Side-by-side fee comparison
- Rating and review comparison
- Export to CSV

### Verification System
- Verified badge for data
- Verified parent reviews only
- Preschool owner verification
- Admin moderation system

### User Tracking
- Comparison history by IP
- Popular comparisons insights
- User behavior analytics

## 🔒 Security Features

- JWT authentication for admin
- Password hashing with bcryptjs
- Input validation with Joi
- SQL injection prevention (Sequelize ORM)
- CORS protection
- Rate limiting on API endpoints
- Helmet for HTTP security headers

## 📈 Deployment

### Backend (Production)
```bash
NODE_ENV=production npm start
```

### Frontend (Production Build)
```bash
npm run build
npm run preview
```

### Deploy to Vercel/Netlify
- Frontend: Deploy `client` folder
- Backend: Deploy to Heroku, AWS, or any Node.js hosting

## 📝 Sample Data

The database includes sample preschools. To add more:

```javascript
// Example: Add preschool via API
POST /api/preschools
{
  "name": "Sunshine Academy",
  "address": "123 Main St",
  "city": "Delhi",
  "state": "Delhi",
  "pincode": "110001",
  "phone": "+91-9999999999",
  "email": "info@sunshine.com",
  "website": "https://sunshine.com"
}
```

## 🐛 Troubleshooting

### Database Connection Issues
- Check MySQL is running
- Verify credentials in .env
- Ensure database exists: `CREATE DATABASE findpreschool;`

### Google Maps API Errors
- Verify API key has Places API and Geocoding API enabled
- Check API quotas and billing
- Ensure API key is not restricted

### CORS Errors
- Update `CORS_ORIGIN` in .env
- Ensure frontend URL matches in backend config

### Port Already in Use
```bash
# Backend (5000)
lsof -i :5000
kill -9 <PID>

# Frontend (5173)
lsof -i :5173
kill -9 <PID>
```

## 📚 Resources

- [Express.js Docs](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Sequelize ORM](https://sequelize.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Google Maps API](https://developers.google.com/maps)
- [Tailwind CSS](https://tailwindcss.com/)

## 📄 License

This project is open source and available under the MIT License.

## 👥 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request

## 📞 Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact: support@findpreschool.org
- Website: https://findpreschool.org

## 🙏 Acknowledgments

- Google Maps Places API for location data
- All parents and educators who contribute reviews
- Our verification team ensuring data accuracy

---

**Happy preschool hunting! 🎓**
