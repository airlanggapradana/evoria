import {Router} from 'express';
import {authMiddleware} from "../middlewares/auth.middleware";
import {getOrganizerDashboard, getRegistrationChart} from "../services/organizer.service";

const organizerRouter = Router();

organizerRouter.get('/', authMiddleware, getOrganizerDashboard)
organizerRouter.get('/get-chart', authMiddleware, getRegistrationChart)

export default organizerRouter;