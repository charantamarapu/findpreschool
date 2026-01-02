import express from 'express';
import {
  compareAdmission,
  compareFranchise,
  getComparisonHistory,
} from '../controllers/comparisonController.js';

const router = express.Router();

router.post('/admission', compareAdmission);
router.post('/franchise', compareFranchise);
router.get('/history', getComparisonHistory);

export default router;
