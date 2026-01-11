import { Router } from "express";
import { getTutorDashboard } from "../controllers/tutorDashboardController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.get("/dashboard", authMiddleware, getTutorDashboard);

export default router;
