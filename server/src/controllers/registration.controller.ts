import {Router} from "express";
import {
  checkInUser,
  getRegistrationDetails, getSingleRegistrationDetail,
  midtransNotification,
  registerEvent
} from "../services/registration.service";
import {authMiddleware} from "../middlewares/auth.middleware";

const registrationRouter = Router();

registrationRouter.get('/:id', authMiddleware, getRegistrationDetails)
registrationRouter.get('/check/:id', authMiddleware, getSingleRegistrationDetail)
registrationRouter.post('/', authMiddleware, registerEvent)
registrationRouter.post('/check-in', checkInUser)
registrationRouter.post('/midtrans-notification', midtransNotification)

export default registrationRouter;