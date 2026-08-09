import express from 'express';
import { trackSearch, getTrendingSearches } from '../controllers/searchController.js';

const router = express.Router();

router.post('/', trackSearch);
router.get('/trending', getTrendingSearches);

export default router;