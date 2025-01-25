// noinspection JSUnusedGlobalSymbols,ES6UnusedImports
import * as express from 'express';

declare global {
     namespace Express {
          /**
           * Extends the Express Request interface to include user information.
           */
          interface Request {
               user?: {
                    /** The username of the authenticated user. */
                    username: string;
                    /** The unique identifier of the authenticated user. */
                    id: string;
               };
          }
     }
}
