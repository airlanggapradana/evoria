import {Router} from "express";
import {midtransNotification, registerEvent} from "../services/registration.service";

const registrationRouter = Router();

registrationRouter.post('/', registerEvent)
registrationRouter.post('/midtrans-notification', midtransNotification)

export default registrationRouter;