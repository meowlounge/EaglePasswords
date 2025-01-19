import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import passwordRoutes from './routes/passwordRoutes';
import userRoutes from './routes/userRoutes';
import statusRoutes from './controller/statusController';
import { Database } from './config/db';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 6969;

const allowedOrigins = [
    'http://localhost:3001',
    'https://eaglepasswords-backend.vercel.app',
    'chrome-extension://jdgglenepaancflogpmgmmgdaifiihmo'
];

const corsOptions: cors.CorsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(session({
    secret: process.env.JWT_SECRET || 'secret',
    resave: false,
    saveUninitialized: true,
}));

Database.getInstance()
    .connect()
    .then(() => {
        console.log('[DB]: Database connected successfully');
    })
    .catch(err => {
        console.error('[ERROR]: Database connection failed:', err);
        process.exit(1);
    });

app.use(authRoutes);
app.use(passwordRoutes);
app.use(userRoutes);
app.use(statusRoutes);

app.listen(PORT, () => {
    console.log(`[INFO]: Server running on http://localhost:${PORT}`);
});

export default app;
