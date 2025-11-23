import {Router} from 'express'
import {getAllOrganizersWithEvents, getIncomingEvents, getOrganizerDetails} from "../services/admin.service";

const adminRouter = Router()

adminRouter.get('/get-incoming-events', getIncomingEvents)
adminRouter.get('/get-all-organizers', getAllOrganizersWithEvents)
adminRouter.get('/get-organizer/:id', getOrganizerDetails)

export default adminRouter