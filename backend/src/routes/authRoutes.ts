import { Router } from 'express';
import { login, loginCallback } from "../controller/authController";

const router = Router();

/**
 * Route to initiate Discord authentication.
 * @route GET /api/auth
 * @group Authentication - Operations related to user authentication
 * @returns {object} 302 - Redirects to the Discord authentication page
 */
router.get('/api/auth/callback', loginCallback);

/**
 * Route to initiate Discord authentication.
 * @route GET /api/auth
 * @group Authentication - Operations related to user authentication
 * @returns {object} 302 - Redirects to the Discord authentication page
 */
router.get('/api/auth', login);


export default router;
