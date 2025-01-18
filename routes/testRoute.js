// import express from ('express')
import  router from  express.Router();
import  {GettestbyID,getalltest,Submittestanswers,Starttest} from '../controllers/testController.js';

router.get('/Getallquestions',getalltest );
router.get('GetquestionbyID/:id',GettestbyID );
router.post('/SubmittestAns/:id',Submittestanswers );
router.post('/Starttest/:id',Starttest );

export default router;