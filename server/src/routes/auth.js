import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();
const publicUser = user => ({ id: user._id, name: user.name, email: user.email, role: user.role, department: user.department, designation: user.designation, phone: user.phone });

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, department, designation } = req.body;
    if (!name || !email || !password || password.length < 8) return res.status(400).json({ message: 'Name, valid email and password (at least 8 characters) are required.' });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(409).json({ message: 'An account with this email already exists.' });
    const count = await User.countDocuments();
    const role = count === 0 && process.env.ALLOW_PUBLIC_HR_REGISTRATION === 'true' ? 'hr' : 'employee';
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), role, department, designation });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    res.status(201).json({ token, user: publicUser(user) });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() }).select('+password');
    if (!user || !user.isActive || !(await bcrypt.compare(password || '', user.password))) return res.status(401).json({ message: 'Incorrect email or password.' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
    res.json({ token, user: publicUser(user) });
  } catch (e) { next(e); }
});

router.get('/me', protect, (req, res) => res.json({ user: publicUser(req.user) }));
export default router;
