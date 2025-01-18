// import express from ('express')
import  router from  express.Router();
import  {addquestions,updatequestion,userdetail} from '../controllers/questionController.js';

router.post('/addquestions',addquestions );
router.post('/updatequestion/:id',updatequestion );
router.get('/user/:id',userdetail );

export default router;