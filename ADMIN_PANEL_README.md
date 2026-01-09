# Admin Panel Setup Guide

## Overview
The FindPreschool admin panel provides a complete web interface for managing all database operations without using MySQL directly.

## Features
- ✅ **Dashboard** - Overview statistics and quick actions
- ✅ **Preschool Management** - CRUD operations, verification, bulk actions
- ✅ **Review Management** - Moderate reviews, verification, deletion
- ✅ **Admin User Management** - Manage admin accounts and permissions
- ✅ **Bulk Operations** - Verify/delete multiple items at once
- ✅ **Secure Authentication** - JWT-based login system

## Default Admin Credentials

After running the database seed, you can login with:

```
Email: admin@abc.org
Password: admin123
```

## Accessing the Admin Panel

1. **Local Development**: http://localhost:5173/admin/login
2. **Production**: https://yourdomain.com/admin/login

## Admin Routes

- `/admin/login` - Admin login page
- `/admin/dashboard` - Main dashboard with statistics
- `/admin/preschools` - Manage preschools
- `/admin/reviews` - Manage reviews
- `/admin/admins` - Manage admin users

## Database Operations Available

### Preschools
- View all preschools with pagination
- Edit preschool details
- Verify/unverify preschools
- Delete preschools
- Bulk verify multiple preschools
- Bulk delete multiple preschools

### Reviews
- View all reviews with preschool context
- Edit review details
- Verify/unverify reviews
- Delete reviews
- Bulk verify multiple reviews
- Bulk delete multiple reviews

### Admin Users
- View all admin users
- Create new admin accounts
- Edit admin details and roles
- Activate/deactivate accounts
- Delete admin accounts

### Dashboard
- Real-time statistics
- Quick action buttons
- Overview of all data

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Role-based Access** - Admin and Moderator roles
- **Protected Routes** - All admin routes require authentication
- **Password Hashing** - Bcrypt password encryption
- **Session Management** - Automatic logout on token expiry

## API Endpoints

All admin operations are available via REST API:

```
POST   /api/admin/login
GET    /api/admin/dashboard/stats
GET    /api/admin/preschools
PUT    /api/admin/preschools/:id
DELETE /api/admin/preschools/:id
GET    /api/admin/reviews
PUT    /api/admin/reviews/:id
DELETE /api/admin/reviews/:id
GET    /api/admin/admins
POST   /api/admin/admins
PUT    /api/admin/admins/:id
DELETE /api/admin/admins/:id
POST   /api/admin/bulk/verify-preschools
POST   /api/admin/bulk/verify-reviews
POST   /api/admin/bulk/delete
```

## Setting Up Additional Admin Users

You can create additional admin users through the admin panel or directly in the database:

```sql
INSERT INTO admin_users (email, password_hash, name, role, active) VALUES
('newadmin@abc.org', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'New Admin', 'admin', TRUE);
```

Password hash is for 'admin123'. Use a password hashing tool to generate hashes for other passwords.

## Troubleshooting

### Login Issues
- Ensure database is seeded with admin user
- Check JWT_SECRET environment variable
- Verify email and password

### Permission Errors
- Check user role (admin/moderator)
- Ensure user is active
- Verify JWT token is valid

### API Errors
- Check network connectivity
- Verify admin token in localStorage
- Check server logs for detailed errors

## Production Deployment

The admin panel is automatically included when you deploy the application. Make sure to:

1. Set `JWT_SECRET` environment variable
2. Seed the database with admin users
3. Configure CORS for your domain
4. Enable HTTPS for security

## Support

For issues with the admin panel:
1. Check browser console for errors
2. Verify API endpoints are accessible
3. Check server logs
4. Ensure database connections are working