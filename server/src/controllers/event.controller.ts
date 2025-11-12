import {Router} from "express"
import {createEvent, deleteEventById, getAllEvents, getEventById, updateEventById} from "../services/event.service";
import {authMiddleware} from "../middlewares/auth.middleware";

const eventRouter = Router();

eventRouter.get('/', getAllEvents)
eventRouter.post('/', authMiddleware, createEvent)
eventRouter.get('/:id', getEventById)
eventRouter.put('/:id', updateEventById)
eventRouter.delete('/:id', authMiddleware, deleteEventById)

export default eventRouter;