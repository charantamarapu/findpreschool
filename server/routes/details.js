import express from 'express';
import {
  updateAdmissionDetails,
  updateFranchiseDetails,
  getFranchiseOpportunities,
} from '../controllers/detailController.js';
import {
  validateRequest,
  schemas,
} from '../middleware/validation.js';
import { authenticateAdmin } from '../middleware/auth.js';

const router = express.Router();

// Admission Details
router.put(
  '/admission/:preschool_id',
  authenticateAdmin,
  validateRequest(schemas.updateAdmissionDetails),
  updateAdmissionDetails
);

// Franchise Details
router.put(
  '/franchise/:preschool_id',
  authenticateAdmin,
  validateRequest(schemas.updateFranchiseDetails),
  updateFranchiseDetails
);

router.get('/franchise/opportunities', getFranchiseOpportunities);

export default router;
