import dotenv from 'dotenv';
dotenv.config();
export default {
  MONGO_URI: process.env.MONGO_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'changeme',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'changeme-refresh',
  PORT: process.env.PORT || 5000,
  // Mail / Frontend
  MAIL_HOST: process.env.MAIL_HOST || '',
  MAIL_PORT: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : 587,
  MAIL_USER: process.env.MAIL_USER || '',
  MAIL_PASS: process.env.MAIL_PASS || '',
  MAIL_FROM: process.env.MAIL_FROM || '',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
};
