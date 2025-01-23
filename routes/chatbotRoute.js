import { Router } from 'express';
import { check, validationResult } from 'express-validator';
import { handleGroqRequest } from '../controllers/groq.controller.js';
import { asyncHandler } from '../utils/asynchandler.js';
import { ApiError } from '../utils/Apierror.js';

const router = Router();

router.post(
    '/',
    [
        check('prompt', 'Prompt is required').not().isEmpty(), // Validation check
    ],
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ApiError(400, 'Validation failed', errors.array());
        }
        await handleGroqRequest(req, res);
    })
);

export default router
