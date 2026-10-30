import { Router } from 'express';
import Leave from '../models/Leave.js';
import User from '../models/User.js';
import { protect, allow } from '../middleware/auth.js';
const router = Router();
router.use(protect);
router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.role === 'employee') filter.user = req.user._id;
    if (req.user.role === 'manager') filter.user = { $in: await User.find({ manager: req.user._id }).distinct('_id') };
    const rows = await Leave.find(filter).populate('user', 'name email department').populate('reviewedBy', 'name').sort({ createdAt: -1 });
    res.json(rows);
  } catch (e) { next(e); }
});
router.post('/', async (req, res, next) => {
  try {
    const { type, from, to, reason } = req.body;
    if (!type || !from || !to || !reason || new Date(to) < new Date(from)) return res.status(400).json({ message: 'Provide a valid leave type, date range and reason.' });
    const row = await Leave.create({ user: req.user._id, type, from, to, reason });
    res.status(201).json(row);
  } catch (e) { next(e); }
});
router.patch('/:id/review', allow('hr','manager'), async (req, res, next) => {
  try {
    const { status, reviewNote = '' } = req.body;
    if (!['approved','rejected'].includes(status)) return res.status(400).json({ message: 'Status must be approved or rejected.' });
    const row = await Leave.findById(req.params.id).populate('user');
    if (!row) return res.status(404).json({ message: 'Leave request not found.' });
    if (req.user.role === 'manager' && String(row.user.manager || '') !== String(req.user._id)) return res.status(403).json({ message: 'You can only review your team requests.' });
    if (row.status !== 'pending') return res.status(409).json({ message: 'This request has already been reviewed.' });
    row.status = status; row.reviewNote = reviewNote; row.reviewedBy = req.user._id;
    await row.save(); res.json(row);
  } catch (e) { next(e); }
});
export default router;
