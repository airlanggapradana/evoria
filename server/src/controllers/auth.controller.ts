import {Router} from "express"
import {login, register} from "../services/auth.service";

const authRouter = Router();

authRouter.post('/login', login)

authRouter.post('/register', register)

export default authRouter;