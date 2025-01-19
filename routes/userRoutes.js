// import express from ('express')
import { Router } from "express";
const router= Router()
import  {
    signup,
    login,
    logout,
    refreshaccesstoken,
    // verifyOtp,
    getcurrentuser,
    updatravatarimage
  } from '../controllers/userController.js'
  import verifyjwt from "../middleware/auth.js";

router.post('/register',signup );
router.post('/login',login );
router.post('/logout',logout );
router.post('/refreshaccesstoken',refreshaccesstoken );
// router.post('/verifyOtp',verifyOtp );
router.patch("/update-avatar", verifyjwt, upload.single("avatar"), updatravatarimage);
router.get('/userdetail',verifyjwt,getcurrentuser );


export default router;