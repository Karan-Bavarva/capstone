import mongoose, { Schema, Document } from 'mongoose';

export interface ICourseReview extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  rating: number;
  review: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourseReviewSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: false },
  },
  { timestamps: true }
);

CourseReviewSchema.index({ user: 1, course: 1 }, { unique: true }); // One review per user per course

export default mongoose.model<ICourseReview>('CourseReview', CourseReviewSchema);
