import express from 'express'
import { addJob, getAllJobs, getApprovedJobs, getCompanyJobs, getJob, getPendingJobs, getSavedJobs, updateJobStatus } from '../controllers/jobsController.js'
import userAuth from '../middlewares/userAuth.js';

const jobsRouter = express.Router()

jobsRouter.post("/addjob", userAuth, addJob);
jobsRouter.post("/getJob", getJob);
jobsRouter.get('/getalljobs', getAllJobs);
jobsRouter.post('/getcompanyjobs', getCompanyJobs);
jobsRouter.post('/getsavedjobs', getSavedJobs);
jobsRouter.post('/updatejobstatus', updateJobStatus);
jobsRouter.get('/getapprovedjobs', getApprovedJobs);
jobsRouter.get('/getpendingjobs', getPendingJobs);

export default jobsRouter;