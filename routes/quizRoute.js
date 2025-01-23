

import  {Router} from  'express';
const router =Router()
import  {GetQuestionsFromAPI,GetquestionbyID,SubmitAns} from '../controllers/questionController.js';

router.get('/Getallquestions',GetQuestionsFromAPI );

router.get('GetquestionbyID/:id',GetquestionbyID );
router.post('/SubmitAns/:id',SubmitAns );

export default router;