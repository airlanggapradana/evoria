import {Router} from "express"
import {createEvent, deleteEventById, getAllEvents, getEventById, updateEventById} from "../services/event.service";

const eventRouter = Router();

eventRouter.get('/', getAllEvents)
eventRouter.post('/', createEvent)
eventRouter.get('/:id', getEventById)
eventRouter.put('/:id', updateEventById)
eventRouter.delete('/:id', deleteEventById)

export default eventRouter;