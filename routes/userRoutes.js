// import express from ('express')
import  router from  express.Router();
import  {
    signup,
    login,
    logout,
    refreshaccesstoken,
    verifyOtp
  } from '../controllers/userController.js'

router.post('/register',signup );
router.post('/login',login );
router.post('/logout',logout );
router.post('/refreshaccesstoken',refreshaccesstoken );
router.post('/verifyOtp',verifyOtp );


export default router;