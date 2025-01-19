import { Router } from "express";
import { getUserById, getUserByUsername } from "../controller/userController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

/**
 * Route to retrieve a user by their ID.
 * @route GET /api/user/{id}
 * @group Users - Operations related to managing users
 * @param {string} id.path.required - The unique ID of the user
 * @returns {object} 200 - A user object
 * @returns {Error} 400 - Bad request if ID is missing
 * @returns {Error} 404 - User not found if no user exists with the provided ID
 * @returns {Error} 500 - Internal server error if an error occurs while retrieving the user
 */
router.get("/api/user/i/:id", authenticateToken, getUserById);

/**
 * Route to retrieve a user by their username.
 * @route GET /api/user/{username}
 * @group Users - Operations related to managing users
 * @param {string} username.path.required - The username of the user
 * @returns {object} 200 - A user object
 * @returns {Error} 400 - Bad request if username is missing
 * @returns {Error} 404 - User not found if no user exists with the provided username
 * @returns {Error} 500 - Internal server error if an error occurs while retrieving the user
 */
router.get("/api/user/u/:username", authenticateToken, getUserByUsername);

export default router;
