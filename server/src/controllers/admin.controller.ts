import {Router} from 'express'
import {
  getIncomingEvents,
  updateEventApproval
} from "../services/admin.service";

const adminRouter = Router()

adminRouter.get('/get-incoming-events', getIncomingEvents)
adminRouter.put('/update-approval-status/:id', updateEventApproval)

export default adminRouter