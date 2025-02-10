import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Profile Schema
const profileSchema = new mongoose.Schema({
  age: {
    type: Number,
    default: null,
  },
  height: {
    type: String,
    default: null,
  },
  weight: {
    type: String,
    default: null,
  },
  goals: {
    type: String,
    default: null,
  },
}, { _id: false }); // Prevent MongoDB from creating _id for subdocuments

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false,
  },
  profile: {
    type: profileSchema,
    default: () => ({
      age: null,
      height: null,
      weight: null,
      goals: null
    }),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
