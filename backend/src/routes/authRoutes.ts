import { Router } from 'express';
import { loginCallback } from "../controller/authController";

const router = Router();

router.get('/api/auth/callback', loginCallback);
export default router;
