import nodemailer from 'nodemailer';
import path from 'path';
import ejs from 'ejs';
import env from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: env.MAIL_PORT === 465, // true for 465, false for other ports
  auth: env.MAIL_USER && env.MAIL_PASS ? { user: env.MAIL_USER, pass: env.MAIL_PASS } : undefined,
});


export async function sendEmail(to: string, subject: string, template: string, locals: any = {}) {
  // Render template file from views/emails (always from project root, not backend/)
  const rootDir = path.resolve(__dirname, '../../');
  const templatePath = path.join(rootDir, 'views', 'emails', `${template}.ejs`);
  const html = await ejs.renderFile(templatePath, locals);

  const info = await transporter.sendMail({
    from: env.MAIL_FROM || undefined,
    to,
    subject,
    html,
  });

  return info;
}

export default { sendEmail };
