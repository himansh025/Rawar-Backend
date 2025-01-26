import {User} from "../Model/User.js";
import asyncHandler from '../utils/asyncHandler.js'
import ApiError from '../utils/Apierror.js'
import  Apiresponse from '../utils/Apiresponse.js'
import { Question } from "../Model/Question.js";
import {Admin} from "../Model/Admin.js";
import bcrypt from "bcryptjs";

const GenerateAccessandRefreshtoken = async (userid) => {
  try {
    const admin = await Admin.findById(userid)    
    const refreshtoken = admin.generateRefreshToken()
    const accesstoken = admin.generateAccessToken()
    admin.refreshtoken = refreshtoken
    await admin.save({ validateBeforeSave: false })    
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



const userdetail = asyncHandler(async (req, res) => {
  try {
console.log("hello");

    const users = await User.find().select("-password -refreshtoken");
console.log(users);

    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
    }

    console.log("All users fetched:", users);

    res.status(200).json({
      success: true,
      data: users,
      message: "Successfully fetched all users",
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


const login =asyncHandler( async (req, res,next) => {
  
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new ApiError("Invalid email or password" );
  }

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) {
    throw new ApiError(400," Invalid email or password")
  }
  const { accesstoken, refreshtoken } = await  GenerateAccessandRefreshtoken(admin._id)
const loggedinuser = await Admin.findById(admin._id).select("-password -refreshtoken")

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
  return res
  .status(200)
  .cookie("accesstoken", accesstoken, options)
  .cookie("refreshtoken", refreshtoken, options)
  .json( new Apiresponse(
    200,extrauserdet
    ,"admin sinup successfully"
  ));
});

export  {addquestions,userdetail,login}