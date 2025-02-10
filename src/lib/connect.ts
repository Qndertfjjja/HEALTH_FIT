import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/health_fit';

if (!mongoose.connections[0].readyState) {
  mongoose.connect(MONGODB_URI);
}

export default async function connectDB() {
  try {
    if (mongoose.connections[0].readyState) {
      return;
    }
    
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}
