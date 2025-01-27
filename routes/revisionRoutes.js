import { Router } from 'express';
const router = Router();

import {
    getQuestionById,
    getAllQuestions,
    createQuestion,
    deleteQuestion,
} from '../controllers/revisionController.js';

router.get('/GetAllquestion', getAllQuestions);
// Get a question by ID
router.get('/GetquestionbyID/:id', getQuestionById);
// Add a single question
router.post('/createQuestion', createQuestion);
// Delete a question 
router.delete('/deletequiz/:id', deleteQuestion);


export default router;
