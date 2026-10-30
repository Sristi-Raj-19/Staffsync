import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, default: null },
  status: { type: String, enum: ['present', 'late', 'absent'], default: 'present' }
}, { timestamps: true });
schema.index({ user: 1, date: 1 }, { unique: true });
export default mongoose.model('Attendance', schema);
