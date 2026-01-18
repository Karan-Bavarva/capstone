// import env from './config/env';
import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import ejs from 'ejs';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import adminRoutes from './routes/adminRoutes';
import certificateRoutes from './routes/certificateRoutes';
import enrollmentRoutes from './routes/enrollmentRoutes';
import tutorRoutes from './routes/tutorRoutes';
import reviewRoutes from './routes/reviewRoutes';
import { errorHandler } from './middlewares/errorHandler';
import path from "path";

const app = express();
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
// Views: used for rendering email templates
app.set('views', path.join(process.cwd(), 'views'));
app.set('view engine', 'ejs');
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"), {
  setHeaders: (res, path) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  }
}));


app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/tutor', tutorRoutes);

app.use('/api/reviews', reviewRoutes);

app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(env.PORT, () => console.log(`Server running on port ${env.PORT}`));
};

app.get("/", (req, res) => {
  res.send("OpenLearn Backend is running...");
});

start();
