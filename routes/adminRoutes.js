import  {Router} from 'express'
const router = Router()
import {login,addquestions,userdetail} from '../controllers/adminController.js'
router.post('/login',login );
router.post('/addquestions',addquestions );
router.get('/users',userdetail );

export default router;