import { Router } from 'express';
import * as authController from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { upload, uploadImage } from '../middlewares/upload';
import { permit } from '../middlewares/roleMiddleware';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
// router.post('/refresh', (req, res) => res.status(501).json({ message: 'Not implemented in seed' }));
router.post('/refresh', authController.refresh);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.get('/me', authMiddleware, authController.me);

router.post("/update-profile",authMiddleware,uploadImage.single("avatar"),authController.updateProfile);
router.post("/update-avatar", authMiddleware, uploadImage.single("avatar"), authController.updateAvatar);
router.post('/update-password', authMiddleware, authController.updatePassword);
router.post("/kyc/upload", authMiddleware, permit('TUTOR'), upload.array("documents", 5),authController.uploadKyc);

export default router;
