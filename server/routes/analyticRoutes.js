import express from "express";
import { weeklyAnalytic } from "../controllers/analyticsController.js";

const analyticRouter = express.Router();

analyticRouter.get('/weekly-analytics', weeklyAnalytic);

export default analyticRouter;