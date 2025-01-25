import {User} from "../Model/User.js";
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/Apierror.js'
import  Apiresponse from '../utils/Apiresponse.js'
import { Question } from "../Model/Question.js";
import {Admin} from "../Model/Admin.js";
import bcrypt from "bcryptjs";

const GenerateAccessandRefreshtoken = async (userid) => {
  try {
    console.log(userid);
    
    const admin = await Admin.findById(userid)
    console.log(admin);
    
    const refreshtoken = admin.generateRefreshToken()
    const accesstoken = admin.generateAccessToken()

    admin.refreshtoken = refreshtoken
    await admin.save({ validateBeforeSave: false })
    // console.log("token",refreshtoken,accesstoken);
    
    return { accesstoken, refreshtoken }
  } catch (error) {
    throw new ApiError(500, "somethng went wrog while generating refresh and access token")
  }
}

const addquestions = asyncHandler( async (req, res) => {

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
    res.status(200)
    .json( new Apiresponse(200,{
      questions,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    },"successfullty question adde by admin") );
});

const updatequestion= asyncHandler( async (req, res) => {

    const question = await Question.findById(req.params.id)
      .select('-correctAnswer');
    
    if (!question) {
      throw new ApiError( 'Question not found' );
    }

    res.status(200)
    .json( new Apiresponse(200,
      question,"successfullty updated question  by admin") );
    // res.json(question);
  
});

 const userdetail=asyncHandler( async (req, res) => {
  try {
    const { answer } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    const isCorrect = answer === question.correctAnswer;

    // Update user's progress
    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        'progress.completedQuestions': 1,
        'progress.correctAnswers': isCorrect ? 1 : 0
      }
    });

    res.json({
      isCorrect,
      explanation: question.explanation
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
const login =asyncHandler( async (req, res,next) => {
  
  const { email, password } = req.body;
  console.log("check",req.body);

  console.log("email,pass",email,password);

  // Find the user by email
  const admin = await Admin.findOne({ email });
  console.log("admin",admin);
  
  if (!admin) {
    throw new ApiError("Invalid email or password" );
  }
  // console.log(user.password);
  

  // Compare password with hashed password
  const isMatch = await bcrypt.compare(password, admin.password);
  console.log(isMatch);
  
  if (!isMatch) {
    throw new ApiError(400," Invalid email or password")
  }

  const { accesstoken, refreshtoken } = await  GenerateAccessandRefreshtoken(admin._id)
console.log("accesstoken refreshtoken ", accesstoken, refreshtoken);

const loggedinuser = await Admin.findById(admin._id).select("-password -refreshtoken")
console.log("loggedin user", loggedinuser);
console.log("role is ",admin.role);

// if(!(admin.role == "admin")){
// throw  new ApiError(500,"admin role no found")
// }
// only modify by the server not the client
const options = {
  httpOnly: true,
  secure: true,
}

let extrauserdet= {
  id: admin._id,
  name: admin.name,
  email: admin.email,
  role: admin.role,
  accesstoken:accesstoken,
  refreshtoken:refreshtoken
  
}
console.log(loggedinuser,extrauserdet, accesstoken, refreshtoken);

  // Send response with token
  return res
  .status(200)
  .cookie("accesstoken", accesstoken, options)
  .cookie("refreshtoken", refreshtoken, options)
  .json( new Apiresponse(
    200,extrauserdet
    ,"admin sinup successfully"
  ));
});







export  {addquestions,updatequestion,userdetail,login}