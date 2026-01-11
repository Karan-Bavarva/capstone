import mongoose, { Schema, Document } from "mongoose";
import LectureSchema, { ILecture } from "./Lecture";

export interface ICourse extends Document {
  title: string;
  description: string;
  image: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  // price: number; // Commented out - all courses are free for now

  tutor: mongoose.Types.ObjectId;
  lectures: ILecture[];

  curriculum: { type: [String], default: [] },


  totalDuration: number;
  studentsCount: number;

  published: boolean;
  is_featured: boolean;
  status: "PENDING" | "APPROVED" | "REJECTED";
}


const CourseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    image: { type: String, default: "" },
    category: { type: String, default: "General" },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    // price: { type: Number, default: 0 }, // Commented out - all courses are free for now

    tutor: { type: Schema.Types.ObjectId, ref: "User", required: true },

    lectures: { type: [LectureSchema], default: [] },
    curriculum: { type: [String], default: [] },
    
    totalDuration: { type: Number, default: 0 },
    studentsCount: { type: Number, default: 0 },

    published: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
    is_featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICourse>("Course", CourseSchema);
