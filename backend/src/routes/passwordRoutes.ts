import { Router } from "express";
import { getPasswords, addPassword, updatePassword, deletePassword } from "../controller/passwordController";
import { authenticateToken } from "../middlewares/authMiddleware";

const router = Router();

/**
 * Route to retrieve all passwords.
 * @route GET /api/passwords
 * @group Passwords - Operations related to managing passwords
 * @returns {array} 200 - An array of password objects (with decrypted passwords)
 * @returns {Error} 500 - Internal server error if passwords cannot be retrieved
 */
router.get("/api/passwords/:id", authenticateToken, getPasswords);

/**
 * Route to add a new password.
 * @route POST /api/passwords
 * @group Passwords - Operations related to managing passwords
 * @param {object} password.body - Password details (title, username, password)
 * @returns {object} 201 - Success message and ID of the new password
 * @returns {Error} 400 - Missing required fields (title, username, or password)
 * @returns {Error} 500 - Internal server error if password cannot be added
 */
router.post("/api/passwords/:id", authenticateToken, addPassword);

/**
 * Route to update an existing password.
 * @route PUT /api/passwords/{id}
 * @group Passwords - Operations related to managing passwords
 * @param {string} id.path - Password ID to be updated
 * @param {object} password.body - Updated password details (title, username, password)
 * @returns {object} 200 - Success message indicating password update
 * @returns {Error} 400 - No fields provided for update
 * @returns {Error} 404 - Password not found with the provided ID
 * @returns {Error} 500 - Internal server error if password cannot be updated
 */
router.put("/api/passwords/:id/:id", authenticateToken, updatePassword);

/**
 * Route to delete an existing password.
 * @route DELETE /api/passwords/{id}
 * @group Passwords - Operations related to managing passwords
 * @param {string} id.path - Password ID to be deleted
 * @returns {object} 200 - Success message indicating password deletion
 * @returns {Error} 404 - Password not found with the provided ID
 * @returns {Error} 500 - Internal server error if password cannot be deleted
 */
router.delete("/api/passwords/:id/:id", authenticateToken, deletePassword);

export default router;
