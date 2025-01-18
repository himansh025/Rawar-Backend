import express from 'express';
import adminController from './admin.controller';
const router = express.Router();

router.post('/register', adminController.register);
router.post('/login', adminController.login);
router.get('/profile', adminController.getAdminProfile);
router.put('/profile', adminController.updateAdminProfile);
router.delete('/delete', adminController.deleteAdmin);

export default router;
