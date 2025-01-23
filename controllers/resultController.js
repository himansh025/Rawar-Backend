import {Result} from '../Model/Result.js'; // Adjust the path if necessary
import Apiresponse from '../utils/Apiresponse.js';
import asyncHandler from '../utils/asyncHandler.js';
// import { User } from '../Model/User.js';
// Assuming you have the `questionState` and the userId when the question is submitted
const saveQuestionResult =asyncHandler( async (req,res) => {
    const userid= req.user._id;
    const questionState= req.body
  try {
    const result = new Result({
      totalAttempts: questionState.totalAttempts,
      correctAnswers: questionState.correctAnswers,
      incorrectAnswers: questionState.incorrectAnswers,
      questionsAttempted: Array.from(questionState.questionsAttempted),  // Converting Set to Array if needed
      userId: userid  // Store user ID to associate with the result
    });

    await result.save();
    
    console.log('Result saved successfully!');
    res
    .status(200)
    .json( new Apiresponse(200,"result saved succesfully"))
  } catch (err) {
    console.error('Error saving result:', err);
  }
}
)
const getResult = async (req, res) => {
  const userId = req.user._id;  // Get the user ID from the authenticated user

  try {
    // Find the result associated with the userId
    const result = await Result.findOne({ userId: userId });

    if (!result) {
      return res.status(404).json({ message: 'Result not found for this user' });
    }

    // Send the result back in the response
    res.status(200).json(result);
  } catch (err) {
    console.error('Error retrieving result:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export {getResult,saveQuestionResult}