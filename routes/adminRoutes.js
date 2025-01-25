import  {Router} from 'express'
const router = Router()
import {login,addquestions,updatequestion,userdetail} from '../controllers/adminController.js'
router.post('/login',login );
// router.post('/singup',signup );
router.post('/addquestions',addquestions );
// router.delete('/delete',deleteQuestion );
router.post('/updatequestion/:id',updatequestion );
router.get('/user/:id',userdetail );

export default router;