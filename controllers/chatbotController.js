import { validationResult } from 'express-validator';
import Groq from 'groq-sdk'; // Import Groq SDK
import  asyncHandler  from '../utils/asyncHandler.js';
import  ApiError  from '../utils/Apierror.js';
import  Apiresponse  from '../utils/Apiresponse.js';
import { User } from '../Model/User.js';
// import { uploadOnCloudinary } from '../utils/cloudniary.js';
import dotenv from 'dotenv';

dotenv.config({
  path: './.env',
});

const groqApiKey = process.env.GROQ_API_KEY;
// console.log(groqApiKey);

if (!groqApiKey) {
  console.error('Error: Missing GROQ_API_KEY in .env file');
  process.exit(1);
}

// Initialize Groq AI client
const groq = new Groq({ apiKey: groqApiKey });

async function getGroqData(prompt) {
  try {
    const result = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-8b-8192",
    });
    return result.choices[0]?.message?.content || "";
  } catch (error) {
    console.error('Error calling Groq AI API:', error);
    throw new ApiError(500, 'Something went wrong while calling Groq AI API');
  }
}

 const handleGroqRequest = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ApiError(400, 'Validation failed', errors.array());
  }

  const { prompt } = req.body;
  if (!prompt?.trim()) {
    throw new ApiError(400, 'Prompt is required');
  }

  const fullPrompt = `Take this query for me and please act as a chatbot for my interactive fiction storytelling platform website. Keep answers as creative as possible, humanly without any bold text or formatting, just simple text and add a friendly and professional sense: ${prompt}`;

  try {
    const result = await getGroqData(fullPrompt);
    return res.status(200).json(new Apiresponse(result, 'Response generated successfully'));
  } catch (error) {
    console.error('Error handling Groq request:', error);
    throw new ApiError(500, 'An error occurred while processing your request');
  }
});

 const handleUserRegistration = asyncHandler(async (req, res) => {
  const { name, password, email,  } = req.body;

  if ([name, password, email].some((field) => field?.trim() === "")) {
    throw new ApiError(400, 'All fields are required');
  }

  try {
    // Example: handle avatar upload
    // const avatarUrl = await uploadOnCloudinary(req.files?.avatar);

    const newUser = new User({
      name,
      password,
      email
    });
    const createdUser = await newUser.save();

    return res.status(201).json(new Apiresponse(createdUser, 'User registered successfully'));
  } catch (error) {
    console.error('Error during user registration:', error);
    throw new ApiError(500, 'Something went wrong while registering the user');
  }
});
export  {handleGroqRequest,handleUserRegistration,}