import {User} from "../Model/User.js";
import {Result } from '../Model/Result.js'
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/Apierror.js'
import  Apiresponse from '../utils/Apiresponse.js'
import nodemailer  from "nodemailer";
import dotenv from 'dotenv'
dotenv.config({
  path: './.env',
});
import uploadOnCloudinary from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";


const tempUserStore = {};
// Function to generate OTP
const generateOTP=(length)=> {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}
console.log("auth",process.env.EMAIL) 
console.log("auth",process.env.PASSWORD) 
// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, 
    pass: process.env.PASSWORD, 
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const GenerateAccessandRefreshtoken = async (userid) => {
  try {
    const user = await User.findById(userid)
    const refreshtoken = user.generateRefreshToken()
    const accesstoken = user.generateAccessToken()

    user.refreshtoken = refreshtoken
    await user.save({ validateBeforeSave: false })
    // console.log("token",refreshtoken,accesstoken);
    
    return { accesstoken, refreshtoken }
  } catch (error) {
    throw new ApiError(500, "somethng went wrog while generating refresh and access token")
  }
}

const signup = asyncHandler(async (req, res) => {
  console.log("hello");
  
  const { name, email, password } = req.body;

  console.log("data",name,email,password);
  
  if (!name || !email || !password) {
    throw new ApiError(400, "All fields (name, email, password) are required");
  }

  // Check if the email already exists
  const existingUser = await User.findOne({ email });
  console.log("exis email", existingUser);
  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }


  const otp = generateOTP(4);
  console.log(otp);
  
  // Temporarily store the user info along with OTP (to be verified later)
  tempUserStore[email] = { name, email, password, otp };
  
  // Send OTP via email
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `Hello! ${name}, Please Verify Your OTP`,
    html: `<strong>Your OTP code is: ${otp}</strong>`,
  };
  console.log("main",mailOptions);
  
  try {
    const data= await transporter.sendMail(mailOptions);
    console.log("data",data);
    
    res.status(200).json(new Apiresponse(200, email, "OTP sent successfully"));
  } catch (error) {
    throw new ApiError(500, `Error while sending OTP: ${error}`);
  }
});


const verifyOtp = asyncHandler(async (req, res, next) => {

  const { email,otp } = req.body;
  console.log("aya",req.body);

  // Check if the OTP exists in the temporary store
  const storedUser = tempUserStore[email];
  if (!storedUser) {
    throw new ApiError(400, "No OTP request found for this email");
  }

  // Validate OTP
  if (storedUser.otp !== otp) {
    throw new ApiError(400, "Invalid OTP");
  }

  // OTP is valid, create user
  const { name, password } = storedUser;

  // Hash the password
  const salt = await bcrypt.genSalt(8);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create and save the new user
  const newUser = new User({ name, email, password: hashedPassword });
  await newUser.save();

  // Clear the temporary store
  delete tempUserStore[email];
  console.log("user",newUser);

  const {accesstoken,refreshtoken}=await GenerateAccessandRefreshtoken(newUser?._id)
  console.log("aya",accesstoken,refreshtoken);

  // Return the created user without sensitive data
  const createdUser = await User.findById(newUser._id).select("-password -refreshtoken");
  
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  const options = {
    httpOnly: true,
    secure: true,
  }
  res
  .status(201)
  .cookie("accesstoken", accesstoken, options)
  .cookie("refreshtoken", refreshtoken, options)
  .json(new Apiresponse(
    200,{
      success: true,
     user:{accesstoken,refreshtoken,createdUser},
     message: 'OTP verified successfully'})
    )});



const login =asyncHandler( async (req, res,next) => {
    const { email, password } = req.body;
    // console.log("check",req.body);

    // console.log("email,pass",email,password);

    // Find the user by email
    const user = await User.findOne({ email });
    // console.log("user",user);
    
    if (!user) {
      throw new ApiError("Invalid email or password" );
    }
    // console.log(user.password);
    

    // Compare password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch);
    
    if (!isMatch) {
      throw new ApiError(400," Invalid email or password")
    }

    const { accesstoken, refreshtoken } = await  GenerateAccessandRefreshtoken(user._id)
  console.log("accesstoken refreshtoken for otp success", accesstoken, refreshtoken);

  const loggedinuser = await User.findById(user._id).select("-password -refreshtoken")
  console.log("loggedin user", loggedinuser);

  // only modify by the server not the client
  const options = {
    httpOnly: true,
    secure: true,
  }

  let extrauserdet= {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }
    // Send response with token
    res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", refreshtoken, options)
    .json( new Apiresponse(
      200,{
        user: {loggedinuser,extrauserdet, accesstoken, refreshtoken}}
      ,"user sinup successfully"
    ));

});

const updatravatarimage = asyncHandler(async (req, res) => {
const updateavatar = req.file.path;
if (!updateavatar) {
  throw new ApiError(400, "update image cover is not found")
}


const avatar = await uploadOnCloudinary(updateavatar)
// console.log("acatar check",avatar);

if (!avatar.url) {
  throw new ApiError(500, "update avatar url missing")
}

const user = await User.findByIdAndUpdate(
  req.user?._id,
  {
    $set:
    {
      avatar: avatar.url
    }
  },
  {
    new: true
  }).select("-password")
user.save()
res
  .status(200)
  .json(new Apiresponse(200, user, "avatar image update successfully"))
}
)

const getcurrentuser = asyncHandler(async (req, res) => {
  const data = req.user// Assuming req.user is populated by your authentication middleware
console.log("data",data);


  if (!isValidObjectId(data)) { // Changed from `if(user)` to `if(!user)`
    throw new ApiError(404, 'User not found'); // Updated to send a 404 status code with the error
  }


  return res
    .status(200)
    .json(new Apiresponse(200,data,"successfully"))
})

const logout = asyncHandler(async (req, res,next) => {
  console.log("user data", req.user);

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshtoken: null
      }
    }
  )


  const options = {
    httpOnly: true,
    secure: true,
  }

  res
    .status(200)
    .clearCookie("accesstoken", options)
    .clearCookie("refreshtoken", options)
    .json(new Apiresponse(200, {}, "successfull logout"))
})

const refreshaccesstoken = asyncHandler(async (req, res,next) => {

  const IncomingRefreshToken = req.cookies.refreshtoken || req.body.refreshtoken

  if (!IncomingRefreshToken) {
    throw new ApiError(401, "unauthorized")
  }

  const DecodedToken = jwt.verify(IncomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

  const user = await User.findById(DecodedToken?._id)

  if (!user) {
    throw new ApiError(401, "invalid refresh token")
  }


  if (IncomingRefreshToken !== user.refreshtoken) {
    throw new ApiError(401, "token is used or expired")
  }

  const options = {
    httpOnly: true,
    secure: true
  }

  const { accesstoken, Newrefreshtoken } = await GenerateAccessandRefreshtoken(user._id)


  res
    .status(200)
    .cookie("accesstoken", accesstoken, options)
    .cookie("refreshtoken", Newrefreshtoken, options)
    .json(new Apiresponse(200,
      {
        accesstoken,
        refreshtoken: Newrefreshtoken
      },
      "refresh token generated"))

})

const getUserProfileStats = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const userAnswers = await Result.find({ userId: userId });

    // console.log("Results found for user:", userAnswers);

    if (!userAnswers || userAnswers.length === 0) {
      const emptyStats = {
        accuracyRate: 0,
        rank: 0,
        streak: 0,
        completedQuestions: 0,
        correctAnswers: 0,
        testsTaken: 0
      };

      return res.status(200).json(
        new Apiresponse(200, 
          { stats: emptyStats, answers: [] }, 
          "No results found for this user"
        )
      );
    }

    // Sum up all attempts and correct answers
    let totalAttempts = 0;
    let totalCorrectAnswers = 0;

    userAnswers.forEach(answer => {
      totalAttempts += answer.totalAttempts || 0;
      
      totalCorrectAnswers += answer.correctAnswers || 0;
    });

    // Calculate accuracy rate - avoid division by zero
    const accuracyRate = totalAttempts > 0 
      ? Math.round((totalCorrectAnswers / totalAttempts) * 100)
      : 0;

    // Calculate unique tests taken
    const testsTaken = new Set(
      userAnswers.map(answer => answer.category)
    ).size;

    const userStats = {
      accuracyRate,
      rank: 1,
      completedQuestions: totalAttempts,
      correctAnswersCount: totalCorrectAnswers,
      testsTaken
    };
    

    return res.status(200).json(
      new Apiresponse(200,
        { 
          stats: userStats, 
          answers: userAnswers 
        },
        "User profile stats retrieved successfully"
      )
    );

  } catch (error) {
    console.error("Error in getUserProfileStats:", error);
    return res.status(500).json(
      new Apiresponse(500, null, "Error retrieving user stats")
    );
  }
});



export  {
  signup,
  login,
  logout,
  getcurrentuser,
  refreshaccesstoken,
  updatravatarimage,
  getUserProfileStats,
  verifyOtp
}
