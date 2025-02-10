import mongoose from 'mongoose';

const sleepSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  quality: {
    type: String,
    enum: ['Poor', 'Fair', 'Good', 'Excellent'],
    required: true,
  },
  notes: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

// Virtual field for duration in hours
sleepSchema.virtual('duration').get(function() {
  return (this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60 * 60);
});

export default mongoose.models.Sleep || mongoose.model('Sleep', sleepSchema);
