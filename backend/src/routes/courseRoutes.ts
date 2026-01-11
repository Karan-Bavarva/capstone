import { Router } from 'express';
import * as courseController from '../controllers/courseController';
import * as courseReviewController from '../controllers/courseReviewController';
import { authMiddleware, optionalAuth } from '../middlewares/authMiddleware';
import { permit } from '../middlewares/roleMiddleware';
import { upload, uploadLectureFiles } from '../middlewares/upload';
import { getCourseDetailsWithStats } from '../controllers/courseStatsController';


const router = Router();
// Course Reviews
router.post('/:id/review', authMiddleware, courseReviewController.submitReview);
router.get('/:id/review', courseReviewController.getCourseReviews);
// New endpoint for just average rating and review count
router.get('/:id/rating', courseReviewController.getCourseRatingSummary);
// import { uploadVideo } from '../middlewares/uploadVideo';

// Public (optional auth: will attach req.user if Authorization header is present)
router.get('/', optionalAuth, courseController.list);
router.get('/featured-courses', courseController.featureCourses);
router.get('/:id', courseController.getOne);

// Create / Update / Delete Course
router.post('/', authMiddleware, permit('TUTOR', 'ADMIN'),upload.single("image"), courseController.create);
router.put("/:id",authMiddleware,permit("TUTOR","ADMIN"),upload.single("image"),courseController.update);
router.delete('/:id', authMiddleware, permit('TUTOR', 'ADMIN'), courseController.remove);
router.get('/:id/details', authMiddleware, permit('TUTOR', 'ADMIN'), getCourseDetailsWithStats);

// Lectures CRUD
router.delete('/:id/lectures/:lectureId', authMiddleware, permit('TUTOR', 'ADMIN'), courseController.deleteLecture);
router.post("/:id/lectures", authMiddleware, permit("TUTOR", "ADMIN"), uploadLectureFiles.fields([{ name: "video", maxCount: 1 },{ name: "noteFiles", maxCount: 5 },]),courseController.addLecture);

router.put("/:id/lectures/:lectureId",authMiddleware,permit("TUTOR", "ADMIN"),uploadLectureFiles.fields([{ name: "video", maxCount: 1 },{ name: "noteFiles", maxCount: 5 },]),courseController.updateLecture);

export default router;
