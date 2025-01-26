import { Router } from 'express';
const router = Router();

import {
    addQuestion,
    bulkAddQuestions,
    getQuestions,
    getQuestionById,
  deleteQuestion,
} from '../controllers/questionController.js';
import {saveQuestionResult,getResult} from '../controllers/resultController.js'
import verifyjwt from '../middleware/auth.js';

router.get('/GetAllquestion', getQuestions);

// Get a question by ID
router.get('/GetquestionbyID/:id', getQuestionById);

router.post('/SubResult',saveQuestionResult );

// Submit an answer 
router.get('/getResult', verifyjwt,getResult);

// Bulk add questions 
router.post('/bulkadd', bulkAddQuestions);

// Add a single question
router.post('/addquestion', addQuestion);

// Delete a question 
router.delete('/deletequiz/:id', deleteQuestion);


export default router;
