import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/health_fit';

if (!mongoose.connections[0].readyState) {
  mongoose.connect(MONGODB_URI);
}

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: {
    age: { type: Number },
    height: { type: String },
    weight: { type: String },
    goals: { type: String }
  }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
