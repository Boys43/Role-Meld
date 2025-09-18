import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import jobsRouter from "./routes/jobsRouter.js";
import "dotenv/config";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRouter.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { startJobsCron } from "./cron/jobsCron.js";

const app = express();
app.use(cookieParser())
app.use(express.json())
const allowedOrigins = [
    "http://localhost:5173",
    "https://role-meld-1.onrender.com",  // add more origins here
];

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

app.use('/uploads', express.static('uploads'));

const PORT = 4000;


app.get('/', (req, res) => {
    res.send("I am Working Bitch!")
})

connectDB();
startJobsCron(); // starts the cron task


app.use('/api/jobs', jobsRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/applications', applicationRouter);

app.listen(PORT, () => {
    console.log(`App Listening on http://localhost:${PORT}`);
})

