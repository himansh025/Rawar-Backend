import mongoose from 'mongoose';


const questionSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['quantitative', 'logical', 'verbal', 'programming', 'dbms']
  },
  subcategory: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['easy', 'medium', 'hard']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswer: {
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


export const  Question=  mongoose.model('Question', questionSchema);
