import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import passwordRoutes from './routes/passwordRoutes';
import userRoutes from './routes/userRoutes';
import statusRoutes from './controller/statusController';
import twoFactorRoutes from './routes/twoFactorRoutes';
import { Database } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6969;

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(
	session({
		secret: process.env.JWT_SECRET || 'secret',
		resave: false,
		saveUninitialized: true,
	})
);

const db = Database.getInstance();

db.query('users', { id: 'test' })
	.then(() => {
		console.log('[DB]: Supabase connected successfully');
	})
	.catch((err) => {
		console.error('[ERROR]: Supabase connection failed:', err);
		process.exit(1);
	});

app.use(authRoutes);
app.use(passwordRoutes);
app.use(userRoutes);
app.use(statusRoutes);
app.use(twoFactorRoutes);

app.listen(PORT, () => {
	console.log(`[INFO]: Server running on http://localhost:${PORT}`);
});

export default app;
