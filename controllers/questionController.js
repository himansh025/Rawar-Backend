import {User} from "../Model/User.js";
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/Apierror.js'
import Apiresponse from '../utils/Apiresponse.js'
// import { Question } from "../Model/Question.js";


// Get all questions with filters
import axios from 'axios';


const GetQuestionsFromAPI = asyncHandler(async (req, res) => {
  const { category, difficulty, limit } = req.query;

  // External API URL
  const apiUrl = `   ''}&type=multiple`;

  try {
    const response = await axios.get(apiUrl);
    const questions = response.data.results;

    res.status(200).json({
      success: true,
      data: questions,
      message: 'Questions fetched from external API successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching questions from API',
    });
  }
});

 const GetquestionbyID = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Simulating fetching question by ID from external API
    const apiUrl = `https://opentdb.com/api.php?amount=1&category=9&type=multiple`;
    const response = await axios.get(apiUrl);

    const question = response.data.results[0];

    if (!question) {
      throw new ApiError(400, 'Question not found');
    }

    // Exclude the correct answer
    const questionWithoutAnswer = {
      question: question.question,
      options: question.incorrect_answers.concat(question.correct_answer),
    };

    return res.status(200).json(
      new Apiresponse(questionWithoutAnswer, 'Question fetched successfully')
    );
  } catch (error) {
    throw new ApiError(500, 'Error fetching question from external API');
  }
});

// Submit Answer for a Question
const SubmitAns = asyncHandler(async (req, res) => {
  const { answer, question } = req.body;

  try {
    // Compare the answer with the correct answer
    const isCorrect = answer === question.correctAnswer;

    // Simulate updating user's progress
    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        'progress.completedQuestions': 1,
        'progress.correctAnswers': isCorrect ? 1 : 0,
      },
    });

    // Include explanation if available
    const explanation = question.explanation || 'No explanation provided.';

    return res.status(200).json(
      new Apiresponse(
        { isCorrect, explanation },
        'Answer submitted successfully'
      )
    );
  } catch (error) {
    throw new ApiError(500, 'Error submitting answer');
  }
});
export { GetQuestionsFromAPI, GetquestionbyID, SubmitAns };

