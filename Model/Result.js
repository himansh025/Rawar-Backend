import mongoose   from "mongoose";


const resultSchema = new mongoose.Schema({
  totalAttempts: {
    type: Number,
    required: true,
    default: 0
  },
  correctAnswers: {
    type: Number,
    required: true,
    default: 0
  },
  incorrectAnswers: {
    type: Number,
    required: true,
    default: 0
  },
  questionsAttempted: {
    type: [String],  // Assuming the questions attempted are stored as an array of IDs or some unique identifier
    required: true,
    default: []
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,  // You can associate it with a user
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

  
  const Result = mongoose.model('Result', resultSchema);
  
  export { Result };
  