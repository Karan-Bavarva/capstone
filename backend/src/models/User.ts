import mongoose, { Schema, Document } from "mongoose";

export type Role = "STUDENT" | "TUTOR" | "ADMIN";

export interface IKycDocument {
  type: "ADDRESS_PROOF" | "PHOTO_ID";
  file: string;
  uploadedAt: Date;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;

  avatar: string;
  bio: string;
  title: string;

  role: Role;
  isSubAdmin?: boolean; // true for sub-admin, false/undefined for main admin
  status: "PENDING" | "ACTIVE" | "REJECTED" | "KYC_PENDING";

  socialLinks: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };

  kyc: {
    documents: IKycDocument[];
    status: "PENDING" | "APPROVED" | "REJECTED";
    reviewedAt?: Date;
  };
  // Password reset
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    title: { type: String, default: "" },

    role: {
      type: String,
      enum: ["STUDENT", "TUTOR", "ADMIN"],
      default: "STUDENT"
    },
    isSubAdmin: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "REJECTED", "KYC_PENDING"],
      default: "PENDING"
    },

    socialLinks: {
      facebook: String,
      linkedin: String,
      twitter: String,
      website: String
    },

    kyc: {
      documents: [
        {
          type: {
            type: String,
            enum: ["ADDRESS_PROOF", "PHOTO_ID"],
            required: true
          },
          file: { type: String, required: true },
          uploadedAt: { type: Date, default: Date.now }
        }
      ],
      status: {
        type: String,
        enum: ["PENDING", "APPROVED", "REJECTED"],
        default: "PENDING"
      },
      reviewedAt: Date
    },
    // Password reset fields
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);
