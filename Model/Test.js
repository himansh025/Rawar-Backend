import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['quantitative', 'logical', 'verbal', 'programming', 'dbms', 'technical']
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  duration: {
    type: Number,
    required: true
  },
  questions: [{
    question: {
      type: String,
      required: true
    },
    options: {
      type: [String],
      required: true
    },
    correctAnswer: {
      type: String,
      required: true
    },
    explanation: {
      type: String,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const Test = mongoose.model('Test', testSchema);