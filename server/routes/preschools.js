import express from 'express';
import {
  getAllPreschools,
  getPreschoolById,
  addPreschool,
  updatePreschool,
} from '../controllers/preschoolController.js';
import {
  validateRequest,
  schemas,
} from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAllPreschools);
router.get('/:id', getPreschoolById);
router.post('/', validateRequest(schemas.addPreschool), addPreschool);
router.put('/:id', validateRequest(schemas.addPreschool), updatePreschool);

export default router;
