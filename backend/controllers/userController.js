import nodemailer from 'nodemailer';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// 🔹 Controller pentru trimiterea linkului de resetare
export const forgotPasswordController = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

  const resetUrl = `https://localhost:4200/#/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    to: email,
    subject: 'Reset your password',
    html: `<p>Click <a href="${resetUrl}">here</a> to reset your password.</p>`
  });

  res.json({ message: 'Reset link sent' });
};

// 🔹 Controller pentru schimbarea parolei (cu token validat)
export const resetPasswordController = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findById(decoded.id || decoded.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = password;
    await user.save();

    res.json({ message: 'Password has been reset successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
