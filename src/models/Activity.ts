import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  activityType: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  intensity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    required: true,
  },
  caloriesBurned: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  notes: String,
});

export default mongoose.models.Activity || mongoose.model('Activity', activitySchema);
