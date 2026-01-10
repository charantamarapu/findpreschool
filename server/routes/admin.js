import express from 'express';
import {
  login,
  getDashboardStats,
  getPreSchools,
  createPreSchool,
  updatePreSchool,
  deletePreSchool,
  getReviews,
  updateReview,
  deleteReview,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  bulkVerifyPreSchools,
  bulkVerifyReviews,
  bulkDelete,
  createAdmissionDetail,
  createPreSchoolImage,
  updatePreSchoolImage,
  deletePreSchoolImage
} from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes (require authentication)
router.use(authenticateAdmin);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// PreSchools management
router.get('/preschools', getPreSchools);
router.post('/preschools', createPreSchool);
router.put('/preschools/:id', updatePreSchool);
router.delete('/preschools/:id', deletePreSchool);

// Reviews management
router.get('/reviews', getReviews);
router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);

// Admin users management
router.get('/admins', getAdmins);
router.post('/admins', createAdmin);
router.put('/admins/:id', updateAdmin);
router.delete('/admins/:id', deleteAdmin);

// Bulk operations
router.post('/bulk/verify-preschools', bulkVerifyPreSchools);
router.post('/bulk/verify-reviews', bulkVerifyReviews);
router.post('/bulk/delete', bulkDelete);

// Admission details management
router.post('/admission', createAdmissionDetail);

// Images management
router.post('/images', createPreSchoolImage);
router.put('/images/:id', updatePreSchoolImage);
router.delete('/images/:id', deletePreSchoolImage);

export default router;