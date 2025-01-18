import User from "../Model/User.js";
import asyncHandler from '../utils/asyncHandler'
import ApiError from '../utils/Apierror.js'
import Apiresponse from '../utils/Apiresponse'
import { Question } from "../Model/Question.js";


// Get all questions with filters
const Getallquestions = asyncHandler(async (req, res) => {
 
    const { category, difficulty, search, limit = 10, page = 1 } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }
    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const skip = (page - 1) * limit;
    const questions = await Question.find(query)
      .select('-correctAnswer') // Don't send correct answer to client
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Question.countDocuments(query);
    const pagination = {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit)
    }

    // throw new ApiError(500, "somethng went wrog while generating refresh and access token")

    return res.status(201).json(
      new Apiresponse(questions, pagination, "Get all questions with filters")
    )
  
});


//    Get question by ID
const GetquestionbyID = asyncHandler(async (req, res) => {

    const question = await Question.findById(req.params.id)
      .select('-correctAnswer');

    if (!question) {
      throw new ApiError(400,"quesiton not found")
    }

    return res.status(201).json(
      new Apiresponse(question, "question get by id  succesfully")
    )

  
});


//   Submit answer for a question
const SubmitAns = asyncHandler(async (req, res) => {
    const { answer } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
    throw new ApiError(400,'Question not found' );
    }

    const isCorrect = answer === question.correctAnswer;

    // Update user's progress
    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        'progress.completedQuestions': 1,
        'progress.correctAnswers': isCorrect ? 1 : 0
      }
    });
 let explanation=  question.explanation
   

    return res.status(201).json(

      new Apiresponse(isCorrect,explanation, "user registered succesfully")
    )
});
export { Getallquestions, GetquestionbyID, SubmitAns };

