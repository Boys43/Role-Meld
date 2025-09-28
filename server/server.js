import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import jobsRouter from "./routes/jobsRouter.js";
import dotenv from "dotenv";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRouter.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { startJobsCron } from "./cron/jobsCron.js";
import analyticRouter from "./routes/analyticRoutes.js";
import path from 'path';
import { fileURLToPath } from 'url';
import blogRouter from "./routes/blogRoutes.js";
import axios from 'axios';
import cron from 'node-cron';
import chatRouter from "./routes/chatBotRoutes.js";

const app = express();
dotenv.config()
app.use(cookieParser());
app.use(express.json());

const allowedOrigins = [
    "http://localhost:5173",           
    "https://role-meld.onrender.com",  
    "https://role-meld-1.onrender.com"
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

const PORT = 4000;

// Lightweight ping route
app.get('/ping', (req, res) => res.sendStatus(200));

app.get('/', (req, res) => {
    res.send("I am Working Bitch!")
});

connectDB();
startJobsCron();

// Ping backend every 5 minutes to prevent cold start
const SELF_URL = process.env.SELF_URL || 'http://localhost:4000/ping';

cron.schedule('*/5 * * * *', async () => {
    try {
        await axios.get(SELF_URL);
        console.log('Pinged self at', new Date().toLocaleTimeString());
    } catch (err) {
        console.log('Error pinging self:', err.message);
    }
});

app.use('/api/jobs', jobsRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/applications', applicationRouter);
app.use('/api/analytics', analyticRouter);
app.use('/api/blog', blogRouter);
app.use('/api/chat', chatRouter)

app.listen(PORT, () => {
    console.log(`App Listening on http://localhost:${PORT}`);
});