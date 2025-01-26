import { Test } from '../Model/Test.js';
import { User } from '../Model/User.js';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/Apierror.js';

export const getAllTests = asyncHandler(async (req, res) => {
  const { category, difficulty } = req.query;
  const query = {};

  if (category) query.category = category;
  if (difficulty) query.difficulty = difficulty;

  const tests = await Test.find(query)
    .select('-questions.correctAnswer')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: tests,
    message: "Tests retrieved successfully"
  });
});
export const addTest = async (req, res) => {
  try {    
    const { title, description, duration, category, difficulty, questions } = req.body;
    if (!title || !description || !duration || !category || !difficulty || !questions || questions.length === 0) {
      return res.status(400).json({ message: 'All fields are required, and there must be at least one question.' });
    }
    const newTest = new Test({
      title:title,
      description:description,
      duration:duration,
      category:category,
      difficulty:difficulty,
      questions:questions,
    });
    await newTest.save();
    res.status(201).json({ message: 'Test added successfully!', test: newTest });
  } catch (error) {
    console.error('Error adding test:', error);
    res.status(500).json({ message: 'Failed to add test. Please try again later.' });
  }
};

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


export const startTest = asyncHandler(async (req, res) => {
  const testId = req.params.id;
  const { userid } = req.body; // Extract userid from req.body

  // console.log("Starting test with ID:", testId, "for user:", userid);
  const test = await Test.findById(testId);
  if (!test) {
    res.status(404);
    throw new Error("Test not found");
  }

  const testSession = {
    testId: test._id,
    startTime: new Date(),
    status: "in-progress",
  };

  const user = await User.findById(userid);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.testSessions.push(testSession);
  await user.save();

  // console.log("User after starting test session:", user);

  res.status(200).json({
    success: true,
    data: testSession,
    message: "Test started successfully",
  });
});


export const submitTestAnswers = asyncHandler(async (req, res) => {
  const { answers } = req.body;
  // console.log("submit test ans",answers);
  
  const test = await Test.findById(req.params.id);
// console.log("test submited",test);

// console.log("userid ",req.body.userid);

  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }

  // Calculate results
  let correct = 0;
  let incorrect = 0;
  
  // console.log(answers);

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
// console.log(totalQuestions,score,accuracy,"sd");

  const user = await User.findById(req.body.userid);
  // console.log("userid find for sub test",user);
  
  const testSession = user.testSessions.find(
    session => session.testId.toString() === test._id.toString() && 
    session.status === 'in-progress'
  );
  await user.save();
  // console.log(user,"userdata after al set");
  
  // console.log("test sess",testSession)

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
    console.log(user,"userdata after al set");
    
  }

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

export const deleteTest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // console.log("body ",req.body);
  console.log("test id",id);
  if (!id) {
    throw new ApiError(400,'Test id  not found');
  }
  const test = await Test.findByIdAndDelete(id);
// console.log("test  after deleting",test);
  res.status(200).json("test delted successfully" );
});