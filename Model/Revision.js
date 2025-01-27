import mongoose from  'mongoose';
// import { Schema } from 'mongoose';

const RevisionSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  description: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  explanation: {
    type: String,
    required: true
  },
  tags: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export const Revision = mongoose.model('Revision', RevisionSchema);

