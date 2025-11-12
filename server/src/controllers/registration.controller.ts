import {Router} from "express";
import {
  checkInUser,
  getRegistrationDetails,
  midtransNotification,
  registerEvent
} from "../services/registration.service";

const registrationRouter = Router();

registrationRouter.get('/:id', getRegistrationDetails)
registrationRouter.post('/', registerEvent)
registrationRouter.post('/check-in', checkInUser)
registrationRouter.post('/midtrans-notification', midtransNotification)

export default registrationRouter;