import { Request, Response } from 'express';
import { authenticator } from 'otplib';
import { Database } from '../config/db';
import { encrypt, decrypt } from '../utils/crypto';

/**
 * Enables 2FA for the user by generating and storing a secret.
 *
 * @param req - The Express request object, containing the user ID as a parameter.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response containing the status of enabling 2FA.
 */
export const enableTwoFactorAuth = async (
     req: Request,
     res: Response
): Promise<void> => {
     const { id } = req.params;

     if (!id) {
          res.status(400).send('ID is required');
          return;
     }

     const db = Database.getInstance();

     try {
          const user = await db.query('users', { id });

          if (!user || user.length === 0) {
               res.status(404).send('User not found');
               return;
          }

          const twoFactorSecret = authenticator.generateSecret();
          const encryptedSecret = encrypt(twoFactorSecret);

          await db.update(
               'users',
               { twoFactorEnabled: true, twoFactorSecret: encryptedSecret },
               { id }
          );

          const otpauthUrl = authenticator.keyuri(
               user[0].username,
               'EaglePasswords',
               twoFactorSecret
          );

          res.json({ message: '2FA enabled', otpauthUrl });
     } catch (error) {
          console.error('enableTwoFactorAuth - Error enabling 2FA:', error);
          res.status(500).send('Error enabling 2FA');
     }
};

/**
 * Verifies the 2FA code entered by the user.
 *
 * @param req - The Express request object, containing the user ID and code as parameters.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response indicating whether the 2FA code is valid.
 */
export const verifyTwoFactorCode = async (
     req: Request,
     res: Response
): Promise<void> => {
     const { id } = req.params;
     const { code } = req.body;

     if (!id || !code) {
          res.status(400).send('ID and code are required');
          return;
     }

     const db = Database.getInstance();

     try {
          const user = await db.query('users', { id });

          if (!user || user.length === 0 || !user[0].twoFactorEnabled) {
               res.status(404).send('User not found or 2FA not enabled');
               return;
          }

          const secret = decrypt(user[0].twoFactorSecret);
          const isValid = authenticator.verify({ token: code, secret });

          if (!isValid) {
               res.status(400).send('Invalid 2FA code');
               return;
          }

          res.json({ message: '2FA code verified successfully' });
     } catch (error) {
          console.error(
               'verifyTwoFactorCode - Error verifying 2FA code:',
               error
          );
          res.status(500).send('Error verifying 2FA code');
     }
};

/**
 * Disables 2FA for the user.
 *
 * @param req - The Express request object, containing the user ID as a parameter.
 * @param res - The Express response object.
 * @returns {Promise<void>} - Sends a response indicating whether 2FA was disabled successfully.
 */
export const disableTwoFactorAuth = async (
     req: Request,
     res: Response
): Promise<void> => {
     const { id } = req.params;

     if (!id) {
          res.status(400).send('ID is required');
          return;
     }

     const db = Database.getInstance();

     try {
          const user = await db.query('users', { id });

          if (!user || user.length === 0) {
               res.status(404).send('User not found');
               return;
          }

          await db.update(
               'users',
               { twoFactorEnabled: false, twoFactorSecret: '' },
               { id }
          );

          res.json({ message: '2FA disabled successfully' });
     } catch (error) {
          console.error('disableTwoFactorAuth - Error disabling 2FA:', error);
          res.status(500).send('Error disabling 2FA');
     }
};
