import { Router } from 'express';
import { getTestById,
     getAllTests,
     addTest,
 submitTestAnswers,
  startTest
 } from '../controllers/testController.js';
import verifyjwt from '../middleware/auth.js';

const router = Router();

router.get('/alltests', getAllTests);
router.post('/start/:id',verifyjwt,startTest);
router.post('/addtest', addTest);
router.get('/tests/:id',verifyjwt, getTestById);
router.post('/submit/:id',verifyjwt, submitTestAnswers);
    

export default router;