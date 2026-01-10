import express from 'express';
import {
  getAllPreSchools,
  getPreSchoolById,
  addPreSchool,
  updatePreSchool,
  getNearbyPreSchools,
} from '../controllers/preschoolController.js';
import {
  validateRequest,
  schemas,
} from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAllPreSchools);
router.get('/nearby', getNearbyPreSchools); // Must be before /:id
router.get('/:id', getPreSchoolById);
router.post('/', validateRequest(schemas.addPreSchool), addPreSchool);
router.put('/:id', validateRequest(schemas.addPreSchool), updatePreSchool);

export default router;
