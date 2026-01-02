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
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getReviews);
router.post(
  '/:preschool_id',
  validateRequest(schemas.submitReview),
  submitReview
);
router.put('/:review_id/verify', verifyAdmin, verifyReview);
router.delete('/:review_id/reject', verifyAdmin, rejectReview);
router.get('/admin/pending', verifyAdmin, getPendingReviews);

export default router;
