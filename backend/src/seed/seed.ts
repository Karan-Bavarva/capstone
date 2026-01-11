import mongoose from 'mongoose';
import env from '../config/env';
import User from '../models/User';
import bcrypt from 'bcrypt';

const seed = async () => {
  await mongoose.connect(env.MONGO_URI);
  const users = [
    { name: 'Admin User', email: 'admin@edu.test', role: 'ADMIN', status: 'ACTIVE' },
    { name: 'Tutor User', email: 'tutor@edu.test', role: 'TUTOR', status: 'ACTIVE' },
    { name: 'Student User', email: 'student@edu.test', role: 'STUDENT', status: 'ACTIVE' }
  ];
  const password = await bcrypt.hash('Password123!', 10);
  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      await User.create({ ...u, password });
      console.log('Created', u.email);
    } else {
      console.log('Exists', u.email);
    }
  }
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
