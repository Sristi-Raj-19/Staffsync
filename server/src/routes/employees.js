import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { protect, allow } from '../middleware/auth.js';
const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const filter = req.user.role === 'employee' ? { _id: req.user._id } : {};
    if (req.user.role === 'manager') filter.manager = req.user._id;
    const users = await User.find(filter).select('-password').populate('manager', 'name email');
    res.json(users);
  } catch (e) { next(e); }
});

router.post('/', allow('hr'), async (req, res, next) => {
  try {
    const { name, email, password, role, department, designation, manager, phone } = req.body;
    if (!name || !email || !password || password.length < 8) return res.status(400).json({ message: 'Name, email and password (8+ characters) are required.' });
    const user = await User.create({ name, email, password: await bcrypt.hash(password, 12), role: ['employee','manager'].includes(role) ? role : 'employee', department, designation, manager: manager || null, phone });
    const result = user.toObject(); delete result.password;
    res.status(201).json(result);
  } catch (e) { next(e); }
});

router.patch('/:id', allow('hr'), async (req, res, next) => {
  try {
    const allowed = ['name','department','designation','phone','manager','role','isActive'];
    const update = Object.fromEntries(Object.entries(req.body).filter(([k]) => allowed.includes(k)));
    const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true }).select('-password');
    if (!user) return res.status(404).json({ message: 'Employee not found.' });
    res.json(user);
  } catch (e) { next(e); }
});
export default router;
