import express from 'express'
import { addJob, getAllJobs, getApprovedJobs, getCategoryJobs, getCompanyJobs, getCompanyJobsById, getJob, getPendingJobs, getSavedJobs, getSponsoredJobs, removeJob, searchJob, updateJobStatus } from '../controllers/jobsController.js'
import userAuth from '../middlewares/userAuth.js';

const jobsRouter = express.Router()

jobsRouter.post("/addjob", userAuth, addJob);
jobsRouter.post("/getJob", getJob);
jobsRouter.get('/getalljobs', getAllJobs);
jobsRouter.post('/getcompanyjobs', getCompanyJobs);
jobsRouter.get('/getsavedjobs',userAuth, getSavedJobs);
jobsRouter.post('/updatejobstatus', updateJobStatus);
jobsRouter.get('/getapprovedjobs', getApprovedJobs);
jobsRouter.get('/getpendingjobs', getPendingJobs);
jobsRouter.post('/searchjobs', searchJob);
jobsRouter.post('/getcategoryjobs', getCategoryJobs);
jobsRouter.get('/getsponsoredjobs', getSponsoredJobs);
jobsRouter.post('/removejob', removeJob);
jobsRouter.post('/getcompanyjobsbyid', getCompanyJobsById);

export default jobsRouter;