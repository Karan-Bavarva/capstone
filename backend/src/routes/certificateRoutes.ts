import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { permit } from "../middlewares/roleMiddleware";
import { downloadCertificate } from "../controllers/certificateController";

const router = Router();

router.get("/download", authMiddleware, permit("STUDENT"), downloadCertificate);

export default router;
