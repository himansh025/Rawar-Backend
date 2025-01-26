
import {User} from "../Model/User.js"
import jwt from "jsonwebtoken"
import asyncHandler  from '../utils/asyncHandler.js'
import ApiError  from '../utils/Apierror.js'
import dotenv from 'dotenv'

dotenv.config({
  path: './.env',
});
 const verifyjwt= asyncHandler(async(req,res,next)=>{
   try {
    const token = req.cookies?.accesstoken || req.header("Authorization")?.replace("Bearer ", "")

    console.log("Authorization Header:", req.header("Authorization"));

    
     if(!token){
         throw new ApiError(401,"unauthorized request")
     }
 
   const decodedtoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
 console.log(decodedtoken);
 
  const user =await User.findById(decodedtoken?._id).select(
     "-password -refreshtoken")
 console.log("authenticated",user);
 
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