import { Router } from 'express';
import {
     getPasswords,
     addPassword,
     updatePassword,
     deletePassword,
} from '../controller/passwordController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/api/passwords/:id', authenticateToken, getPasswords);
router.post('/api/passwords/:id', authenticateToken, addPassword);
router.put('/api/passwords/:id/:id', authenticateToken, updatePassword);
router.delete('/api/passwords/:id/:id', authenticateToken, deletePassword);

export default router;
