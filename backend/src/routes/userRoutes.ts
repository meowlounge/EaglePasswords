import { Router } from 'express';
import {
     deleteUserById,
     getUserById,
     getUserByUsername,
     updateUser,
} from '../controller/userController';
import { authenticateToken } from '../middlewares/authMiddleware';

const router = Router();

router.get('/api/users/:id', authenticateToken, getUserById);
router.get('/api/users/u/:username', authenticateToken, getUserByUsername);
router.delete('/api/users/:id', authenticateToken, deleteUserById);
router.put('/api/users/:id', authenticateToken, updateUser);

export default router;
