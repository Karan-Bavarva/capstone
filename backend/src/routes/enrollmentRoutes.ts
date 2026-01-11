
import { Router } from 'express';
import * as enrollmentController from '../controllers/enrollmentController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permit } from '../middlewares/roleMiddleware';

const router = Router();

// Student: Dashboard summary
router.get('/dashboard', authMiddleware, permit('STUDENT'), enrollmentController.dashboard);

// Tutor/Admin: Unblock a student from a course
router.patch(
  '/:courseId/students/:studentId/unblock',
  authMiddleware,
  permit('TUTOR', 'ADMIN'),
  enrollmentController.unblockStudent
);

// Tutor/Admin: Block a student from a course
router.delete(
  '/:courseId/students/:studentId',
  authMiddleware,
  permit('TUTOR', 'ADMIN'),
  enrollmentController.blockStudent
);

router.post('/:courseId', authMiddleware, permit('STUDENT'), enrollmentController.enroll);

router.get('/my', authMiddleware, permit('STUDENT', 'TUTOR'), enrollmentController.my);

router.get(
  '/:courseId/students',
  authMiddleware,
  permit('TUTOR', 'ADMIN'),
  enrollmentController.students
);

router.get(
  '/:courseId/progress',
  authMiddleware,
  permit('STUDENT'),
  enrollmentController.getProgress
);

router.post(
  '/:courseId/progress',
  authMiddleware,
  permit('STUDENT'),
  enrollmentController.updateProgress
);

export default router;
