// LectureSchema.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ILecture extends Document {
  title: string;
  videoUrl: string;
  duration: number;
  order: number;
  description: string;
  thumbnail: string;
  isPreview: boolean;
  resourceFiles: string[];
  notes?: string;
  noteFiles?: string[];
}

const LectureSchema = new Schema<ILecture>({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  duration: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
  description: { type: String, default: "" },
  thumbnail: { type: String, default: "" },
  isPreview: { type: Boolean, default: false },
  resourceFiles: { type: [String], default: [] },

  notes: { type: String, default: "" },
  noteFiles: { type: [String], default: [] },
});

export default LectureSchema;
