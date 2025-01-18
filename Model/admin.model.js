import mongoose from 'mongoose';

// Admin Schema
const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'admin',
    enum: ['admin', 'superadmin'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  progress: {
    questionsReviewed: {
      type: Number,
      default: 0,
    },
    questionsAdded: {
      type: Number,
      default: 0,
    },
  },
  managedQuestions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
  }],
});

AdminSchema.pre('save', function(next) {
  if (this.isModified('password')) {
    this.updatedAt = Date.now();
  }
  next();
});

export default mongoose.model('Admin', AdminSchema);
