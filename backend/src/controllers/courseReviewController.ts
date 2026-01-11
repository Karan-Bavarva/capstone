// GET /api/courses/:id/rating - get average rating and review count for a course
export const getCourseRatingSummary = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id;
    const reviews = await CourseReview.find({ course: courseId });
    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    return success(res, 'Course rating summary', { avgRating, reviewCount: reviews.length });
  } catch (err) {
    return failure(res, 'Error fetching rating summary', err);
  }
};
import { Request, Response } from 'express';
import CourseReview from '../models/CourseReview';
import { success, failure } from '../utils/response';

// POST /api/courses/:id/review - submit or update review for a course
export const submitReview = async (req: Request, res: Response) => {
  try {
    const { rating, review } = req.body;
    const userId = req.user._id;
    const courseId = req.params.id;
    if (!courseId || !rating) {
      return failure(res, 'Course ID and rating are required.');
    }
    const reviewDoc = await CourseReview.findOneAndUpdate(
      { user: userId, course: courseId },
      { rating, review },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return success(res, 'Review submitted', reviewDoc);
  } catch (err) {
    return failure(res, 'Error submitting review', err);
  }
};

// GET /api/courses/:id/review - get average rating and all reviews for a course
export const getCourseReviews = async (req: Request, res: Response) => {
  try {
    const courseId = req.params.id;
    const reviews = await CourseReview.find({ course: courseId }).populate('user', 'name');
    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    return success(res, 'Course reviews', { avgRating, reviews });
  } catch (err) {
    return failure(res, 'Error fetching reviews', err);
  }
};
