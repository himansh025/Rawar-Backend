import {Result} from '../Model/Result.js'; 
import asyncHandler from '../utils/asyncHandler.js';
import { User } from '../Model/User.js';
import ApiError from '../utils/Apierror.js'

const saveQuestionResult = asyncHandler(async (req, res) => {
  const userid = req.user._id; 
  const questionState = req.body; 


  console.log("questionstte",questionState);
  const questionsAttempted = questionState.questionsAttempted || new Set();

    // Create a new Result document
    const result = new Result({
      totalAttempts: questionState.totalAttempts,
      correctAnswers: questionState.correctAnswers,
      incorrectAnswers: questionState.incorrectAnswers,
      questionsAttempted: Array.from(questionsAttempted),
      userId: userid // Associate the result with the user
    });
    await result.save();
    const user = await User.findById(userid);
    if (!user) {
      throw new ApiError(500,"User not found");
    }
    console.log("weuw",questionState);
    
    user.progress.completedQuestions += questionState.stats.totalAttempts;
    user.progress.correctAnswers += questionState.stats.correctAnswers;
    await user.save();
    console.log("Result saved successfully!");
    res.status(200).json({
      success: true,
      message: "Result saved successfully",
      data: result
    });
});

const getResult = async (req, res) => {
  const userId = req.user._id;  // Get the user ID from the authenticated user


    // Find the result associated with the userId
    const result = await Result.findOne({ userId: userId });

    if (!result) {
      return res.status(404).json({ message: 'Result not found for this user' });
    }

    // Send the result back in the response
    res.status(200).json(result);
};

export {getResult,saveQuestionResult}