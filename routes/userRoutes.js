// import express from ('express')
import { Router } from "express";
const router = Router()
import {
  signup,
  login,
  logout,
  refreshaccesstoken,
  verifyOtp,
  getcurrentuser,
  getUserProfileStats,
  updatravatarimage
} from '../controllers/userController.js'
import verifyjwt from "../middleware/auth.js";
import upload from '../middleware/multer.middleware.js'


router.post('/signup', signup
);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refreshaccesstoken', refreshaccesstoken);
router.post('/verifyOtp',verifyOtp );
router.patch("/avatar", verifyjwt, upload.single("avatar"), updatravatarimage);
router.get('/userdetail', verifyjwt, getcurrentuser);
router.get('/UserProfileStats', verifyjwt, getUserProfileStats);


export default router;