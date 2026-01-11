import { Request, Response } from 'express';
import * as authService from '../services/authService';
import { success, failure } from '../utils/response';
import jwt from 'jsonwebtoken';
import env from '../config/env';

export const signup = async (req: Request, res: Response) => {
  const { name, email, password, userType } = req.body;
  const result = await authService.signup(name, email, password, userType);
  if (!result.status) return failure(res, result.message, result.data);
  try {
    const mailer = await import('../utils/mailer');
    await mailer.sendEmail(
      email,
      'Welcome to Edu-Platform',
      'welcome-user',
      { name }
    );
    // Send to admin (assuming admin email is in env)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    await mailer.sendEmail(
      adminEmail,
      'New User Registration',
      'welcome-admin',
      { name, email, userType }
    );
  } catch (e) {
    // Optionally log email errors, but do not block signup
    console.error('Signup email error:', e);
  }
  return success(res, result.message, result.data);
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  if (!result.status) return failure(res, result.message);
  return success(res, result.message, result.data);
};

export const me = async (req: Request, res: Response) => {
  return success(res, 'User data fetched', req.user);
};

export const updateProfile = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { name, email, title, bio } = req.body;

  const avatar = req.file ? `/uploads/user/${req.file.filename}` : undefined;

  const result = await authService.updateProfile(userId, name, email, avatar, title, bio);

  if (!result.status) return failure(res, result.message);
  return success(res, result.message, result.data);
};

export const updateAvatar = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const file = req.file;

  if (!file) {
    return failure(res, 'Avatar image is required');
  }

  const result = await authService.updateAvatar(userId, file);
  if (!result.status) return failure(res, result.message);

  return success(res, result.message, result.data);
};

export const updatePassword = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const { currentPassword, newPassword } = req.body;

  const result = await authService.updatePassword(userId, currentPassword, newPassword);

  if (!result.status) return failure(res, result.message);
  return success(res, result.message, []);
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await authService.forgotPassword(email);
  if (!result.status) return failure(res, result.message);
  return success(res, result.message);
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, email, newPassword } = req.body;
  const result = await authService.resetPassword(token, email, newPassword);
  if (!result.status) return failure(res, result.message);
  return success(res, result.message);
};

export const uploadKyc = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const files = req.files as Express.Multer.File[];
  const { types } = req.body; // array: ["AADHAR", "PAN"]

  if (!files || files.length === 0) {
    return failure(res, "No KYC documents uploaded");
  }

  const result = await authService.uploadKyc(userId, files, types);
  if (!result.status) return failure(res, result.message);

  return success(res, result.message, result.data);
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return failure(res, 'Refresh token missing');
    }

    jwt.verify(token, env.JWT_REFRESH_SECRET, (err: any, user: any) => {
      if (err) return failure(res, 'Invalid refresh token');

      const accessToken = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: '15m' });

      return success(res, 'Access token refreshed', { accessToken });
    });
  } catch (error) {
    return failure(res, 'Server error', error);
  }
};
