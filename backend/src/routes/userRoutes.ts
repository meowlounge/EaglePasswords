import { Router } from "express";
import { deleteUserById, disableTwoFactorAuth, enableTwoFactorAuth, getUserById, getUserByUsername, verifyTwoFactorCode } from "../controller/userController";
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
router.delete("/api/user/i/:id", authenticateToken, deleteUserById);

/**
 * Route to enable 2FA for a user.
 * @route POST /api/user/enable-2fa/{id}
 * @group Users - Operations related to managing users
 * @param {string} id.path.required - The unique ID of the user
 * @returns {object} 200 - Success message with OTP Auth URL
 * @returns {Error} 400 - Bad request if ID is missing
 * @returns {Error} 404 - User not found if no user exists with the provided ID
 * @returns {Error} 500 - Internal server error if an error occurs while enabling 2FA
 */
router.post("/api/user/enable-2fa/:id", authenticateToken, enableTwoFactorAuth);

/**
 * Route to verify 2FA code.
 * @route POST /api/user/verify-2fa/{id}
 * @group Users - Operations related to managing users
 * @param {string} id.path.required - The unique ID of the user
 * @param {string} code.body.required - The 2FA code entered by the user
 * @returns {object} 200 - Success message if the 2FA code is valid
 * @returns {Error} 400 - Invalid 2FA code if the provided code is incorrect
 * @returns {Error} 404 - User not found or 2FA not enabled for the user
 * @returns {Error} 500 - Internal server error if an error occurs while verifying the 2FA code
 */
router.post("/api/user/verify-2fa/:id", authenticateToken, verifyTwoFactorCode);

/**
 * Route to disable 2FA for a user.
 * @route POST /api/user/disable-2fa/{id}
 * @group Users - Operations related to managing users
 * @param {string} id.path.required - The unique ID of the user
 * @returns {object} 200 - Success message if 2FA is disabled
 * @returns {Error} 400 - Bad request if ID is missing
 * @returns {Error} 404 - User not found if no user exists with the provided ID
 * @returns {Error} 500 - Internal server error if an error occurs while disabling 2FA
 */
router.post("/api/user/disable-2fa/:id", authenticateToken, disableTwoFactorAuth);


export default router;
