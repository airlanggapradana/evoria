import {Router} from 'express';
import {authMiddleware} from "../middlewares/auth.middleware";
import {downloadOrganizerReportPDF, getOrganizerDashboard, getRegistrationChart} from "../services/organizer.service";

const organizerRouter = Router();

organizerRouter.get('/', authMiddleware, getOrganizerDashboard)
organizerRouter.get('/get-chart', authMiddleware, getRegistrationChart)
organizerRouter.get('/reports', authMiddleware, downloadOrganizerReportPDF)

export default organizerRouter;