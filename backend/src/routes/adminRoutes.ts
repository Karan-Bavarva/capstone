
import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { permit } from '../middlewares/roleMiddleware';
import * as courseController from '../controllers/courseController';

const router = Router();
// Sub-admin creation (main admin only)
router.post('/sub-admins', authMiddleware, permit('ADMIN'), adminController.createSubAdmin);

// Admin Dashboard Summary
router.get('/dashboard-summary', authMiddleware, permit('ADMIN'), adminController.dashboardSummary);

// USERS
router.get('/users', authMiddleware, permit('ADMIN'), adminController.listUsers);
router.get('/users/:id', authMiddleware, permit('ADMIN'), adminController.userDetails);
router.put('/users/:id/status', authMiddleware, permit('ADMIN'), adminController.changeStatus);
router.put('/users/:id/role', authMiddleware, permit('ADMIN'), adminController.changeRole);
router.delete('/users/:id', authMiddleware, permit('ADMIN'), adminController.deleteUser);

// COURSES
router.get('/courses', authMiddleware, permit('ADMIN'), adminController.listCourses);
router.put('/courses/:id/approve', authMiddleware, permit('ADMIN'), adminController.approveCourse);
router.put('/:id/status', authMiddleware, permit('ADMIN'), courseController.changeStatus);

// TUTORS
router.get('/tutors', authMiddleware, permit('ADMIN'), adminController.listTutors);
router.post('/tutors', authMiddleware, permit('ADMIN'), adminController.createTutor);
router.put('/tutors/:id', authMiddleware, permit('ADMIN'), adminController.updateTutor);


router.get('/users/:id/kyc', authMiddleware, permit('ADMIN'), adminController.getUserKyc);
router.post('/users/:id/kyc/approve', authMiddleware, permit('ADMIN'), adminController.approveKyc);
router.post('/users/:id/kyc/reject', authMiddleware, permit('ADMIN'), adminController.rejectKyc);

export default router;
