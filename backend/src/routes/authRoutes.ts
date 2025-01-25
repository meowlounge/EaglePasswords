import { Router } from 'express';
import { login, loginCallback } from '../controller/authController';

const router = Router();

router.get('/api/auth/callback', loginCallback);
router.get('/api/auth', login);
export default router;
