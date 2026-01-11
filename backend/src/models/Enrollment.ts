// backend/src/models/Enrollment.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IProgress {
  lectureId: mongoose.Types.ObjectId;
  timeSpent: number;
  completed: boolean;
}

export interface IEnrollment extends Document {
  student: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;

  progress: IProgress[];
  completedLectures: number;
  progressPercent: number;

  lastWatchedAt: Date;
  isBlocked?: boolean;
}

const ProgressSchema = new Schema<IProgress>({
  lectureId: { type: Schema.Types.ObjectId, ref: "Lecture", required: true },
  timeSpent: { type: Number, default: 0 },
  completed: { type: Boolean, default: false },
});

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    student: { type: Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },

    progress: { type: [ProgressSchema], default: [] },

    completedLectures: { type: Number, default: 0 },
    progressPercent: { type: Number, default: 0 },

    lastWatchedAt: { type: Date, default: null },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IEnrollment>("Enrollment", EnrollmentSchema);