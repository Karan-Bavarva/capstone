import User from '../models/User';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import mailer from '../utils/mailer';
import env from '../config/env';

export const signup = async (name: string, email: string, password: string, userType: string) => {
  const existing = await User.findOne({ email });
  if (existing) {
    return {
      status: false,
      message: 'Email already in use',
      data: null,
    };
  }
  try {
    const hashed = await bcrypt.hash(password, 10);
    const status = userType === 'TUTOR' ? 'KYC_PENDING' : 'PENDING';

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: userType,
      status,
    });

    return {
      status: true,
      message: 'Signup successful',
      data: user,
    };
  } catch (error) {
    return {
      status: false,
      message: 'Runtime error occurred',
      data: error,
    };
  }
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) {
    return { status: false, message: 'Invalid credentials', data: null };
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return { status: false, message: 'Invalid credentials', data: null };
  }

  if (user.role !== 'TUTOR' && user.status !== 'ACTIVE') {
    return { status: false, message: 'Account not active', data: null };
  }

  const access = generateAccessToken({ id: user._id, role: user.role });
  const refresh = generateRefreshToken({ id: user._id });

  return {
    status: true,
    message: 'Login successful',
    data: { user, access, refresh },
  };
};

export const updateProfile = async (
  userId: string,
  name: string,
  email: string,
  avatar?: string,
  title?: string,
  bio?: string
) => {
  const emailExists = await User.findOne({
    email,
    _id: { $ne: userId },
  });

  if (emailExists) {
    return { status: false, message: "Email already in use", data: null };
  }

  const updateData: any = { name, email, title, bio};

  if (avatar) {
    updateData.avatar = avatar;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true }
  );

  return {
    status: true,
    message: "Profile updated successfully",
    data: user,
  };
};

export const updateAvatar = async (
  userId: string,
  file: Express.Multer.File
) => {
  const user = await User.findById(userId);
  if (!user) {
    return { status: false, message: "User not found" };
  }
  user.avatar = `/uploads/user/${file.filename}`;
  await user.save();

  return {
    status: true,
    message: "Avatar updated successfully",
    data: user,
  };
};



export const updatePassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId);
  if (!user) return { status: false, message: 'User not found' };

  const match = await bcrypt.compare(currentPassword, user.password);
  if (!match) return { status: false, message: 'Current password is incorrect' };

  const hashed = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(userId, { password: hashed });

  return { status: true, message: 'Password updated successfully' };
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    return { status: false, message: 'No user found with that email' };
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const hashed = crypto.createHash('sha256').update(resetToken).digest('hex');

  user.resetPasswordToken = hashed;
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
  await user.save();

  const resetUrl = `${env.FRONTEND_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

  try {
    await mailer.sendEmail(email, 'Password reset', 'reset-password', { name: user.name || 'User', resetUrl });
    return { status: true, message: 'Password reset email sent' };
  } catch (error: any) {
    // Cleanup tokens on failure
    user.resetPasswordToken = undefined as any;
    user.resetPasswordExpires = undefined as any;
    await user.save();
    return { status: false, message: 'Failed to send email', data: error };
  }
};

export const resetPassword = async (token: string, email: string, newPassword: string) => {
  if (!token || !email || !newPassword) {
    return { status: false, message: 'Token, email and new password are required' };
  }

  const hashed = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({ email, resetPasswordToken: hashed, resetPasswordExpires: { $gt: new Date() } });
  if (!user) return { status: false, message: 'Invalid or expired token' };

  const passwordHash = await bcrypt.hash(newPassword, 10);
  user.password = passwordHash;
  user.resetPasswordToken = undefined as any;
  user.resetPasswordExpires = undefined as any;
  await user.save();

  return { status: true, message: 'Password has been reset successfully' };
};

export const uploadKyc = async (
  userId: string,
  files: Express.Multer.File[],
  types: string[]
) => {
  try {
    if (!types || types.length !== files.length) {
      return { status: false, message: "Document types mismatch" };
    }

    const documents = files.map((file, index) => {
      return {
        type: types[index],
        file: `/uploads/courses/${file.filename}`, // multer already saved it
        uploadedAt: new Date(),
      };
    });
    await User.findByIdAndUpdate(userId, {
      $push: { "kyc.documents": { $each: documents } },
      $set: { status: "KYC_SUBMITTED" },
    });

    const updatedUser = await User.findById(userId);

    return {
      status: true,
      message: "KYC uploaded successfully",
      data: { user: updatedUser },
    };
  } catch (error: any) {
    console.error("KYC UPLOAD ERROR:", error);
    return { status: false, message: error.message };
  }
};

