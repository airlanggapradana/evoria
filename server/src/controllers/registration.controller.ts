import {Router} from "express";
import {
  checkInUser,
  getRegistrationDetails,
  midtransNotification,
  registerEvent
} from "../services/registration.service";
import {authMiddleware} from "../middlewares/auth.middleware";

const registrationRouter = Router();

registrationRouter.get('/:id', authMiddleware, getRegistrationDetails)
registrationRouter.post('/', authMiddleware, registerEvent)
registrationRouter.post('/check-in', checkInUser)
registrationRouter.post('/midtrans-notification', midtransNotification)

export default registrationRouter;