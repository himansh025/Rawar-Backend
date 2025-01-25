import mongoose from 'mongoose';
import { Schema } from 'mongoose';
// import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: 'https://example.com/default-avatar.png' // Replace with the actual default URL
  },
  role: { 
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  progress: {
    completedQuestions: {
      type: Number,
      default: 0
    },
    correctAnswers: {
      type: Number,
      default: 0
    },
    testsTaken: {
      type: Number,
      default: 0
    }
  },
  testSessions: [
    {
      testId: {
        type: Schema.Types.ObjectId,
        ref: 'Test',
        required: true
      },
      startTime: {
        type: Date,
        default: Date.now
      },
      status: {
        type: String,
        enum: ['in-progress', 'completed'],
        required: true
      }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });


userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model('User', userSchema);
