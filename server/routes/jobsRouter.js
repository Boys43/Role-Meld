import express from 'express'
import { addJob, getAllJobs, getCompanyJobs, getJob, getSavedJobs } from '../controllers/jobsController.js'
import userAuth from '../middlewares/userAuth.js';

const jobsRouter = express.Router()

jobsRouter.post("/addjob", userAuth, addJob);
jobsRouter.post("/getJob", getJob);
jobsRouter.get('/getalljobs', getAllJobs);
jobsRouter.post('/getcompanyjobs', getCompanyJobs);
jobsRouter.post('/getsavedjobs', getSavedJobs)

export default jobsRouter;