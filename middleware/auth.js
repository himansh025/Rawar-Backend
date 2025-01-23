
import {User} from "../Model/User.js"
import jwt from "jsonwebtoken"
import asyncHandler  from '../utils/asyncHandler.js'
import ApiError  from '../utils/Apierror.js'

// const bcrypt = require("bcryptjs");
// const uploadOnCloudinary =require('../utils/cloudniary.js')
// const  Apiresponse=require('../utils/Apiresponse.js')

 const verifyjwt= asyncHandler(async(req,res,next)=>{
   try {
     const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ","")
     if(!token){
         throw new ApiError(401,"unauthorized request")
     }
 console.log(token);
 
   const decodedtoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 
  const user =await User.findById(decodedtoken?._id).select(
     "-password -refreshtoken")
 console.log("authenticated");
 
     if(!user){
         throw new ApiError(404,"invalid access token")
     }
 
     req.user=user;
     next();

   } catch (error) {
    throw new ApiError(401,"error")
   }


})
export default verifyjwt