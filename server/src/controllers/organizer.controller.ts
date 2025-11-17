import {Router} from 'express';
import {authMiddleware} from "../middlewares/auth.middleware";
import {getOrganizerDashboard} from "../services/organizer.service";

const organizerRouter = Router();

organizerRouter.get('/', authMiddleware, getOrganizerDashboard)

export default organizerRouter;