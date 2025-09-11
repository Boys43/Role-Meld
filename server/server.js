import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import jobsRouter from "./routes/jobsRouter.js";
import "dotenv/config";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRouter.js";

const app = express();
app.use(cookieParser())
app.use(express.json())
app.use(cors({origin: "http://localhost:5173", credentials: true}));
app.use('/uploads', express.static('uploads'));

const PORT = 4000;


app.get('/', (req,res)=>{
    res.send("I am Working Bitch!")
})

connectDB();

app.use("/api/jobs", jobsRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(PORT, ()=>{
    console.log(`App Listening on http://localhost:${PORT}`);
})

