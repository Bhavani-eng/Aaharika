require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seedAdmin = async () => {
  await connectDB();

  const adminExists = await User.findOne({ role: 'admin' });
  if (adminExists) {
    console.log('Admin already exists:', adminExists.email);
    process.exit(0);
  }

  const admin = await User.create({
    name: 'Aaharika Admin',
    email: process.env.ADMIN_EMAIL || 'admin@aaharika.org',
    password: process.env.ADMIN_PASSWORD || 'admin123456',
    role: 'admin',
    isVerified: true,
    isActive: true,
  });

  console.log('Admin created successfully:');
  console.log('Email:', admin.email);
  console.log('Password:', process.env.ADMIN_PASSWORD || 'admin123456');
  process.exit(0);
};

seedAdmin().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
