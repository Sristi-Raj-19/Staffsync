import { Router } from 'express';
import Attendance from '../models/Attendance.js';
import { protect, allow } from '../middleware/auth.js';
const router = Router();
router.use(protect);

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'employee') filter.user = req.user._id;
    if (req.user.role === 'manager') filter.user = { $in: (await (await import('../models/User.js')).default.find({ manager: req.user._id }).distinct('_id')).concat([req.user._id]) };
    if (req.query.userId && req.user.role !== 'employee') filter.user = req.query.userId;
    const rows = await Attendance.find(filter).populate('user', 'name email department').sort({ date: -1 }).limit(200);
    res.json(rows);
  } catch (e) { next(e); }
});

router.post('/check-in', async (req, res, next) => {
  try {
    const date = new Date().toISOString().slice(0,10);
    const existing = await Attendance.findOne({ user: req.user._id, date });
    if (existing) return res.status(409).json({ message: 'You have already checked in today.' });
    const row = await Attendance.create({ user: req.user._id, date, checkIn: new Date(), status: 'present' });
    res.status(201).json(row);
  } catch (e) { next(e); }
});

router.patch('/:id/check-out', async (req, res, next) => {
  try {
    const row = await Attendance.findById(req.params.id);
    if (!row) return res.status(404).json({ message: 'Attendance record not found.' });
    if (String(row.user) !== String(req.user._id) && req.user.role !== 'hr') return res.status(403).json({ message: 'Not allowed.' });
    if (row.checkOut) return res.status(409).json({ message: 'Already checked out.' });
    row.checkOut = new Date(); await row.save(); res.json(row);
  } catch (e) { next(e); }
});
export default router;
