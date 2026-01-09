# API Testing Guide - FindPreschool.org

Use these examples to test the API endpoints with tools like Postman, Insomnia, or curl.

## Base URL
```
http://localhost:5000/api
```

## 🏥 Health Check
```
GET /health
```

Response:
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## 🏫 Preschools Endpoints

### 1. Get All Preschools
```
GET /preschools?limit=20&offset=0&city=Delhi&minFee=5000&maxFee=25000&minRating=3
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sunshine Academy",
      "address": "123 Main St",
      "city": "Delhi",
      "state": "Delhi",
      "pincode": "110001",
      "latitude": 28.6139,
      "longitude": 77.2090,
      "phone": "+91-9999999999",
      "email": "info@sunshine.com",
      "website": "https://sunshine.com",
      "verified_status": true,
      "images": [
        {
          "id": 1,
          "image_url": "https://...",
          "is_primary": true
        }
      ],
      "admission": {
        "monthly_fee": 15000,
        "annual_fee": 5000,
        "verified_rating": 4.8,
        "total_reviews": 45
      }
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 20,
    "offset": 0
  }
}
```

### 2. Get Single Preschool Details
```
GET /preschools/1
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Sunshine Academy",
    "address": "123 Main St",
    "city": "Delhi",
    "images": [...],
    "admission": {
      "monthly_fee": 15000,
      "annual_fee": 5000,
      "registration_fee": 10000,
      "hidden_charges_json": {
        "transport": 2000,
        "activity": 1000
      },
      "age_criteria": "2-4 years",
      "verified_rating": 4.8,
      "total_reviews": 45
    },
    "franchise": {
      "franchise_available": true,
      "initial_investment": 500000,
      "royalty_percentage": 5,
      "royalty_type": "percentage"
    },
    "reviews": [
      {
        "id": 1,
        "parent_name": "Deva Datta",
        "rating": 5,
        "facilities_rating": 5,
        "teachers_rating": 4.5,
        "curriculum_rating": 5,
        "safety_rating": 5,
        "review_text": "Great school!",
        "created_at": "2024-01-01T10:00:00Z"
      }
    ]
  }
}
```

### 3. Add New Preschool (Admin)
```
POST /preschools
Content-Type: application/json

{
  "name": "Rainbow Kids School",
  "address": "456 Park Road",
  "city": "Mumbai",
  "state": "Maharashtra",
  "pincode": "400001",
  "latitude": 19.0760,
  "longitude": 72.8777,
  "phone": "+91-8888888888",
  "email": "info@rainbowkids.com",
  "website": "https://rainbowkids.com"
}
```

Response: 201 Created
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Rainbow Kids School",
    ...
  },
  "message": "Preschool added successfully"
}
```

### 4. Update Preschool (Admin)
```
PUT /preschools/1
Content-Type: application/json

{
  "name": "Sunshine Academy Updated",
  "phone": "+91-9999999999",
  "email": "newemail@sunshine.com"
}
```

---

## 🗺️ Google Maps Endpoints

### 1. Fetch Preschools from Google Maps
```
POST /google-maps/fetch
Content-Type: application/json

{
  "location": "Delhi",
  "radius": 15000
}
```

Response:
```json
{
  "success": true,
  "message": "Preschools fetched from Google Maps",
  "data": {
    "added": 12,
    "skipped": 5,
    "total": 17
  }
}
```

### 2. Search Google Places
```
GET /google-maps/search?query=preschool&location=Bangalore
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "place_id": "ChIJr...",
      "name": "Preschool Name",
      "formatted_address": "123 Street",
      "geometry": {
        "location": {
          "lat": 12.9716,
          "lng": 77.5946
        }
      }
    }
  ]
}
```

---

## 📊 Comparison Endpoints

### 1. Compare Admission Details
```
POST /comparison/admission
Content-Type: application/json

{
  "preschool_ids": [1, 2, 3]
}
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sunshine Academy",
      "city": "Delhi",
      "admission": {
        "monthly_fee": 15000,
        "annual_fee": 5000,
        "registration_fee": 10000,
        "verified_rating": 4.8,
        "total_reviews": 45
      },
      "totalAnnualCost": 195000
    },
    {
      "id": 2,
      "name": "Rainbow Kids School",
      "city": "Mumbai",
      "admission": {
        "monthly_fee": 18000,
        "annual_fee": 6000,
        "registration_fee": 12000,
        "verified_rating": 4.6,
        "total_reviews": 32
      },
      "totalAnnualCost": 228000
    }
  ]
}
```

### 2. Compare Franchise Details
```
POST /comparison/franchise
Content-Type: application/json

{
  "preschool_ids": [1, 2, 3, 4]
}
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sunshine Academy",
      "franchise_available": true,
      "initial_investment": 500000,
      "royalty_percentage": 5,
      "royalty_type": "percentage"
    }
  ]
}
```

### 3. Get Comparison History
```
GET /comparison/history
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_ip": "192.168.1.1",
      "compared_preschool_ids": "[1, 2, 3]",
      "comparison_type": "admission",
      "created_at": "2024-01-15T10:00:00Z"
    }
  ]
}
```

---

## ⭐ Review Endpoints

### 1. Get Verified Reviews
```
GET /reviews?preschool_id=1&limit=10&offset=0
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "parent_name": "Deva Datta",
      "rating": 5,
      "facilities_rating": 5,
      "teachers_rating": 4.5,
      "curriculum_rating": 5,
      "safety_rating": 5,
      "review_text": "Excellent preschool with caring staff.",
      "created_at": "2024-01-10T08:30:00Z"
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 10,
    "offset": 0
  }
}
```

### 2. Submit New Review
```
POST /reviews/1
Content-Type: application/json

{
  "parent_name": "Jane Smith",
  "parent_email": "jane@example.com",
  "rating": 4.5,
  "facilities_rating": 4,
  "teachers_rating": 4.5,
  "curriculum_rating": 5,
  "safety_rating": 4.5,
  "review_text": "Good preschool with helpful teachers."
}
```

Response: 201 Created
```json
{
  "success": true,
  "data": {
    "id": 46,
    "preschool_id": 1,
    "parent_name": "Jane Smith",
    "rating": 4.5,
    "verified": false
  },
  "message": "Review submitted. It will be verified before publishing."
}
```

### 3. Verify Review (Admin)
```
PUT /reviews/46/verify
Authorization: Bearer <JWT_TOKEN>
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 46,
    "verified": true
  },
  "message": "Review verified"
}
```

### 4. Get Pending Reviews (Admin)
```
GET /reviews/admin/pending?limit=20&offset=0
Authorization: Bearer <JWT_TOKEN>
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 46,
      "parent_name": "Jane Smith",
      "rating": 4.5,
      "Preschool": {
        "id": 1,
        "name": "Sunshine Academy"
      }
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 20,
    "offset": 0
  }
}
```

---

## 📋 Details Endpoints

### 1. Update Admission Details (Admin)
```
PUT /details/admission/1
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "monthly_fee": 15000,
  "annual_fee": 5000,
  "registration_fee": 10000,
  "hidden_charges_json": {
    "transport": 2000,
    "activity_fee": 1000,
    "caution_deposit": 5000
  },
  "age_criteria": "2.5-4.5 years",
  "academic_year_start": "April"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "preschool_id": 1,
    "monthly_fee": 15000,
    ...
  },
  "message": "Admission details updated"
}
```

### 2. Update Franchise Details (Admin)
```
PUT /details/franchise/1
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "franchise_available": true,
  "initial_investment": 500000,
  "royalty_percentage": 5,
  "royalty_type": "percentage"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "franchise_available": true,
    "initial_investment": 500000
  },
  "message": "Franchise details updated"
}
```

### 3. Get Franchise Opportunities
```
GET /details/franchise/opportunities?minInvestment=100000&maxInvestment=1000000&city=Delhi&limit=10
```

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "franchise_available": true,
      "initial_investment": 500000,
      "royalty_percentage": 5,
      "Preschool": {
        "id": 1,
        "name": "Sunshine Academy",
        "city": "Delhi"
      }
    }
  ],
  "pagination": {
    "total": 8,
    "limit": 10,
    "offset": 0
  }
}
```

---

## 🧪 Testing with cURL

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Get All Preschools
```bash
curl "http://localhost:5000/api/preschools?city=Delhi&limit=5"
```

### Add Preschool
```bash
curl -X POST http://localhost:5000/api/preschools \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Preschool",
    "city": "Delhi",
    "address": "Test Address"
  }'
```

### Submit Review
```bash
curl -X POST http://localhost:5000/api/reviews/1 \
  -H "Content-Type: application/json" \
  -d '{
    "parent_name": "Test Parent",
    "parent_email": "test@example.com",
    "rating": 4.5,
    "review_text": "Great school!"
  }'
```

### Fetch from Google Maps
```bash
curl -X POST http://localhost:5000/api/google-maps/fetch \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Delhi",
    "radius": 10000
  }'
```

### Compare Admission
```bash
curl -X POST http://localhost:5000/api/comparison/admission \
  -H "Content-Type: application/json" \
  -d '{
    "preschool_ids": [1, 2, 3]
  }'
```

---

## ⚠️ Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "name",
      "message": "name is required"
    }
  ]
}
```

### Not Found (404)
```json
{
  "success": false,
  "message": "Preschool not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

---

## 🔐 Authentication

Admin endpoints require JWT token in header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## 📌 Notes

- All timestamps are in UTC (ISO 8601 format)
- Pagination uses limit/offset pattern
- Numeric fields support decimals
- JSON fields store complex data
- Images use direct URLs
- Ratings are 0-5 scale

---

**Ready to test! Start your servers and use these examples.** 🚀
