import { Request, Response } from 'express';
import CourseReview from '../models/CourseReview';
import Course from '../models/Course';
import { success, failure } from '../utils/response';

// Create or update a review
export const submitReview = async (req: Request, res: Response) => {
  try {
    const { courseId, rating, review } = req.body;
    const userId = req.user._id;
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

// Get average rating and reviews for a course
export const getCourseReviews = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const reviews = await CourseReview.find({ course: courseId }).populate('user', 'name');
    const avgRating = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;
    return success(res, 'Course reviews', { avgRating, reviews });
  } catch (err) {
    return failure(res, 'Error fetching reviews', err);
  }
};

// Admin: Get all reviews
export const getAllReviews = async (req: Request, res: Response) => {
  try {
    const reviews = await CourseReview.find().populate('user', 'name').populate('course', 'title');
    return success(res, 'All reviews', reviews);
  } catch (err) {
    return failure(res, 'Error fetching all reviews', err);
  }
};
