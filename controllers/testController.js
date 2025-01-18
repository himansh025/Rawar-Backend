
import User from "../Model/User.js";
import asyncHandler from '../utils/asyncHandler'
import ApiError from '../utils/Apierror.js'
import  Apiresponse from '../utils/Apiresponse'
import { Test } from "../Model/Test.js";


// Get all available tests
const getalltest= asyncHandler( async (req, res) => {
    const { category, difficulty } = req.query;
    const query = {};

    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const tests = await Test.find(query)
      .select('-questions.correctAnswer') // Don't send correct answers
      .sort({ createdAt: -1 });

      return res.status(201).json(

        new Apiresponse( tests, "get all test succesfully")
      )
});

//    Get test by ID
const   GettestbyID= asyncHandler( async (req, res) => {
    const test = await Test.findById(req.params.id)
      .select('-questions.correctAnswer');
    
    if (!test) {
    throw new ApiError(500,'Test not found' );
    }
    return res.status(201).json(

        new Apiresponse( test, "get  test by id succesfully")
      )
} 
);

//    Start a test
const Starttest= asyncHandler( async (req, res) => {
    const test = await Test.findById(req.params.id);
    
    if (!test) {

    throw new ApiError(500, 'Test not found' );
    }

    // Create test session
    const testSession = {
      testId: test._id,
      startTime: new Date(),
      status: 'in-progress'
    };

    await User.findByIdAndUpdate(req.user.id, {
      $push: { testSessions: testSession }
    });

    return res.status(201).json(

        new Apiresponse( testSession, "Test started successfully")
      )
  
});

//  Submit test answers
const Submittestanswers = asyncHandler(async (req, res) => {
  const { answers } = req.body;

  // Fetch the test by ID
  const test = await Test.findById(req.params.id);
  if (!test) {
    throw new ApiError(500, 'Test not found');
  }

  // Calculate results
  let correct = 0;
  let incorrect = 0;

  test.questions.forEach((question, index) => {
    if (answers[index] === question.correctAnswer) {
      correct++;
    } else {
      incorrect++;
    }
  });

  // Calculate score and accuracy
  const totalQuestions = test.questions.length;
  const score = correct * 4 - incorrect; // Example scoring system
  const accuracy = (correct / totalQuestions) * 100;

  // Update the user's test session
  const sessionUpdate = {
    'testSessions.$[session].status': 'completed',
    'testSessions.$[session].endTime': new Date(),
    'testSessions.$[session].score': score,
    'testSessions.$[session].accuracy': accuracy
  };

  const userUpdate = {
    $inc: { 'progress.testsTaken': 1 },
    $set: sessionUpdate
  };

  const sessionFilters = {
    arrayFilters: [
      { 'session.testId': test._id, 'session.status': 'in-progress' }
    ]
  };

  await User.findByIdAndUpdate(req.user.id, userUpdate, sessionFilters);

  // Respond with the results
  return res.status(201).json(
    new Apiresponse({
      score,
      accuracy,
      correct,
      incorrect,
      totalQuestions
    }, "Submitted answers successfully")
  );
});


export  {GettestbyID,getalltest,Submittestanswers,Starttest}