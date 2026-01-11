// src/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import env from '../config/env';
import User, { IUser } from '../models/User';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = auth.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;  // Now req.user is properly set
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Optional auth: if a valid Bearer token is present, attach `req.user`, otherwise proceed as guest
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return next();
  }

  const token = auth.split(' ')[1];
  try {
    const decoded: any = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (user) {
      req.user = user;
    }
  } catch (err) {
    // ignore invalid token and continue as guest
  }
  return next();
};
