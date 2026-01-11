import jwt from 'jsonwebtoken';
import env from '../config/env';
export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: '7d' });
};
export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};
