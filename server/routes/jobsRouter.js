import express from 'express'
import { addJob, getAllJobs, getApprovedJobs, getCategoryJobs, getCompanyJobs, getJob, getPendingJobs, getSavedJobs, getSponsoredJobs, searchJob, updateJobStatus } from '../controllers/jobsController.js'
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
jobsRouter.post('/searchjobs', searchJob);
jobsRouter.post('/getcategoryjobs', getCategoryJobs);
jobsRouter.get('/getsponsoredjobs', getSponsoredJobs);

export default jobsRouter;