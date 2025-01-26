import { Router } from 'express';
import { getTestById,
     getAllTests,
     addTest,
 submitTestAnswers,
  startTest,
  deleteTest
 } from '../controllers/testController.js';
import verifyjwt from '../middleware/auth.js';

const router = Router();

router.get('/alltests', getAllTests);
router.post('/start/:id',startTest);
router.post('/addtest', addTest);
router.get('/tests/:id', getTestById);
router.post('/submit/:id', submitTestAnswers);
router.delete('/deletetest/:id', deleteTest); 

export default router;