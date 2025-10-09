import express from 'express';
import { banUser, changePassword, checkAdmin, deleteAccount, deleteUser, getPendingRecruiters, isAuthenticated, login, logout, register, unBanUser, updateRecruiterStatus, verifyEmail } from '../controllers/authController.js';
import userAuth from '../middlewares/userAuth.js';

const authRouter = express.Router()

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get("/is-auth", userAuth, isAuthenticated)
authRouter.get('/check-admin', userAuth, checkAdmin);
authRouter.post('/verify-account', verifyEmail);
authRouter.post('/delete-user', deleteUser);
authRouter.post('/change-password', changePassword);
authRouter.post('/delete-account', deleteAccount);
authRouter.post('/ban-user', banUser);
authRouter.post('/unban-user', unBanUser);
authRouter.get('/pending-recruiters', getPendingRecruiters);
authRouter.post('/update-recruiter-status', updateRecruiterStatus);


export default authRouter;