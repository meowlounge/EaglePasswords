import { Router } from 'express';
import {
     disableTwoFactorAuth,
     enableTwoFactorAuth,
     verifyTwoFactorCode,
} from '../controller/twoFactorController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.post(
     '/api/twofactor/enable/:id',
     authenticateToken,
     enableTwoFactorAuth
);
router.post(
     '/api/twofactor/verify/:id',
     authenticateToken,
     verifyTwoFactorCode
);
router.post(
     '/api/twofactor/disable/:id',
     authenticateToken,
     disableTwoFactorAuth
);

export default router;
