import express from 'express';
import {
  login,
  getDashboardStats,
  getPreschools,
  createPreschool,
  updatePreschool,
  deletePreschool,
  getReviews,
  updateReview,
  deleteReview,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  bulkVerifyPreschools,
  bulkVerifyReviews,
  bulkDelete,
  createAdmissionDetail,
  createPreschoolImage,
  updatePreschoolImage,
  deletePreschoolImage
} from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/login', login);

// Protected routes (require authentication)
router.use(authenticateAdmin);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Preschools management
router.get('/preschools', getPreschools);
router.post('/preschools', createPreschool);
router.put('/preschools/:id', updatePreschool);
router.delete('/preschools/:id', deletePreschool);

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
router.post('/bulk/verify-preschools', bulkVerifyPreschools);
router.post('/bulk/verify-reviews', bulkVerifyReviews);
router.post('/bulk/delete', bulkDelete);

// Admission details management
router.post('/admission', createAdmissionDetail);

// Images management
router.post('/images', createPreschoolImage);
router.put('/images/:id', updatePreschoolImage);
router.delete('/images/:id', deletePreschoolImage);

export default router;