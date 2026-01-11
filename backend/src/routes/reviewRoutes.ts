import express from 'express';
import { submitReview, getCourseReviews, getAllReviews } from '../controllers/reviewController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permit } from '../middlewares/roleMiddleware';

const router = express.Router();

// User submits or updates a review
router.post('/', authMiddleware, submitReview);

// Get reviews and average rating for a course
router.get('/:courseId', getCourseReviews);

export default router;
