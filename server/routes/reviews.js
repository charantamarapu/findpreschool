import express from 'express';
import {
  getReviews,
  submitReview,
  verifyReview,
  rejectReview,
  getPendingReviews,
} from '../controllers/reviewController.js';
import {
  validateRequest,
  schemas,
} from '../middleware/validation.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getReviews);
router.post(
  '/:preschool_id',
  validateRequest(schemas.submitReview),
  submitReview
);
router.put('/:review_id/verify', authenticateAdmin, verifyReview);
router.delete('/:review_id/reject', authenticateAdmin, rejectReview);
router.get('/admin/pending', authenticateAdmin, getPendingReviews);

export default router;
