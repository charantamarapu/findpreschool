import express from 'express';
import {
  fetchFromGoogleMaps,
  searchGooglePlaces,
} from '../controllers/googleMapsController.js';
import {
  validateRequest,
  schemas,
} from '../middleware/validation.js';

const router = express.Router();

router.post(
  '/fetch',
  validateRequest(schemas.googleMapsFetch),
  fetchFromGoogleMaps
);
router.get('/search', searchGooglePlaces);

export default router;
