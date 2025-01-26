import { Result } from '../Model/Result.js';
import asyncHandler from '../utils/asyncHandler.js';
import { User } from '../Model/User.js';
import ApiError from '../utils/Apierror.js'

const saveQuestionResult = asyncHandler(async (req, res) => {
  // const userid = req.user._id;
  const {questionState,userid} = req.body;
  console.log("ques,id",questionState,userid);
  // console.log("questionstte",questionState);
  const questionsAttempted = questionState.questionsAttempted || new Set();

  const result = new Result({
    totalAttempts: questionState.totalAttempts,
    correctAnswers: questionState.correctAnswers,
    incorrectAnswers: questionState.incorrectAnswers,
    questionsAttempted: Array.from(questionsAttempted),
    userId: userid // Associate the result with the user
  });
  const user = await User.findById(userid);
  if (!user) {
    throw new ApiError(500, "User not found");
  }
  // console.log("weuw",questionState);    
  user.progress.completedQuestions += questionState.stats.totalAttempts;
  user.progress.correctAnswers += questionState.stats.correctAnswers;
  await user.save();
  await result.save();
  res.status(200).json({
    success: true,
    message: "Result saved successfully",
    data: result
  });
});

const getResult = async (req, res) => {
  const userId = req.body.id;  // Get the user ID from the authenticated user
  const result = await Result.findOne({ userId: userId });
  if (!result) {
    return res.status(404).json({ message: 'Result not found for this user' });
  }
  res.status(200).json(result);
};

export { getResult, saveQuestionResult }