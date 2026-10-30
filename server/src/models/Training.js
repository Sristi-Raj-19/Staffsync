import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  duration: { type: String, default: '1 hour' },
  category: { type: String, default: 'General' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  enrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });
export default mongoose.model('Training', schema);
