import express from 'express';
import { checkAdmin, isAuthenticated, login, logout, register } from '../controllers/authController.js';
import userAuth from '../middlewares/userAuth.js';


const authRouter = express.Router()

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get("/is-auth", userAuth, isAuthenticated )
authRouter.get('/check-admin', userAuth, checkAdmin);


export default authRouter;