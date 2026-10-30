import { Router } from 'express';
import Announcement from '../models/Announcement.js';
import Training from '../models/Training.js';
import { protect, allow } from '../middleware/auth.js';
const router = Router();
const routerApi = Router();
routerApi.use(protect);

routerApi.get('/announcements', async (req, res, next) => {
  try { res.json(await Announcement.find({ $or: [{ audience: 'all' }, { audience: req.user.role }] }).populate('author','name').sort({ createdAt: -1 })); }
  catch (e) { next(e); }
});
routerApi.post('/announcements', allow('hr'), async (req, res, next) => {
  try {
    const { title, body, audience = 'all' } = req.body;
    if (!title || !body) return res.status(400).json({ message: 'Title and message are required.' });
    res.status(201).json(await Announcement.create({ title, body, audience, author: req.user._id }));
  } catch (e) { next(e); }
});
routerApi.get('/trainings', async (req, res, next) => {
  try { res.json(await Training.find().populate('createdBy','name').sort({ date: 1 })); }
  catch (e) { next(e); }
});
routerApi.post('/trainings', allow('hr','manager'), async (req, res, next) => {
  try {
    const { title, description, date, duration, category } = req.body;
    if (!title || !description || !date) return res.status(400).json({ message: 'Title, description and date are required.' });
    res.status(201).json(await Training.create({ title, description, date, duration, category, createdBy: req.user._id }));
  } catch (e) { next(e); }
});
routerApi.post('/trainings/:id/enroll', async (req, res, next) => {
  try {
    const item = await Training.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Training not found.' });
    if (!item.enrolled.some(id => String(id) === String(req.user._id))) item.enrolled.push(req.user._id);
    await item.save(); res.json(item);
  } catch (e) { next(e); }
});
export default routerApi;
