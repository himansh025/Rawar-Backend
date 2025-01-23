import { Test } from '../Model/Test.js';
import { User } from '../Model/User.js';
import asyncHandler from 'express-async-handler';

// Get all available tests
export const getAllTests = asyncHandler(async (req, res) => {
  const { category, difficulty } = req.query;
  const query = {};

  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;

  const tests = await Test.find(query)
    .select('-questions.correctAnswer')
    .sort({ createdAt: -1 });

    console.log("test",tests);
    
  res.status(200).json({
    success: true,
    data: tests,
    message: "Tests retrieved successfully"
  });
});

// src/controllers/testController.js

export const addTest = async (req, res) => {
  try {
    console.log(req.body);
    
    const { title, description, duration, category, difficulty, questions } = req.body;

    // Basic validation
    if (!title || !description || !duration || !category || !difficulty || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'All fields are required, and there must be at least one question.' });
    }

    // Create a new test
    const newTest = new Test({
      title,
      description,
      duration,
      category,
      difficulty,
      questions,
    });

    // Save the test to the database
    await newTest.save();

    res.status(201).json({ message: 'Test added successfully!', test: newTest });
  } catch (error) {
    console.error('Error adding test:', error);
    res.status(500).json({ message: 'Failed to add test. Please try again later.' });
  }
};


// Get test by ID
export const getTestById = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id)
    .select('-questions.correctAnswer');
  
  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }

  res.status(200).json({
    success: true,
    data: test,
    message: "Test retrieved successfully"
  });
});

// Start a test
export const startTest = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);
  console.log(  "userr");  
  console.log("user id", req.user._id);  // This should work

  // console.log(  "userr",req.user_._id);  

  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }

  const testSession = {
    testId: test._id,
    startTime: new Date(),
    status: 'in-progress'
  };

  // console.log(  "userr",req.user_.id);  

  // Note: In a real application, you would get the user from authentication
  const user = await User.findById(req.user._id);
  user.testSessions.push(testSession);
  await user.save();

  res.status(200).json({
    success: true,
    data: testSession,
    message: "Test started successfully"
  });
});

// Submit test answers
export const submitTestAnswers = asyncHandler(async (req, res) => {
  const { answers } = req.body;
  console.log("submit test ans",answers);
  
  const test = await Test.findById(req.params.id);
console.log("test submited",test);

  if (!test) {
    res.status(404);
    throw new Error('Test not found');
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

  const totalQuestions = test.questions.length;
  const score = totalQuestions * 4 - incorrect*4 ;
  const accuracy = (correct / totalQuestions) * 100;
  console.log("score",score);
  console.log("totalques",totalQuestions);
  console.log("acc",accuracy);

  // Update user's test session
  const user = await User.findById(req.user._id);
  const testSession = user.testSessions.find(
    session => session.testId.toString() === test._id.toString() && 
    session.status === 'in-progress'
  );

  if (testSession) {
    testSession.status = 'completed';
    testSession.endTime = new Date();
    testSession.score = score;
    testSession.accuracy = accuracy;

    // Update overall progress
    user.progress.testsTaken += 1;
    const totalTests = user.testSessions.length;
    console.log("total test after  submit",totalTests);
    const totalScore = user.testSessions.reduce((sum, session) => sum + (session.score || 0), 0);
    user.progress.averageScore = totalScore / totalTests;
    console.log("total score",totalScore);
    await user.save();
  }
  console.log( score,
    accuracy,
    correct,
    incorrect,
    totalQuestions);
  

  res.status(200).json({
    success: true,
    data: {
      score,
      accuracy,
      correct,
      incorrect,
      totalQuestions
    },
    message: "Test submitted successfully"
  });
});