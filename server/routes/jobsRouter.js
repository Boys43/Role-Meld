import express from 'express'
import { addJob } from '../controllers/jobsController.js'

const jobsRouter = express.Router()

jobsRouter.post("/addjob", addJob);


export default jobsRouter