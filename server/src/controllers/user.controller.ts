import {Router} from "express";
import {authMiddleware} from "../middlewares/auth.middleware";
import {getMe, getUserDetails} from "../services/user.service";

const userRouter = Router();

userRouter.get('/me', authMiddleware, getMe)
userRouter.get('/', authMiddleware, getUserDetails)

export default userRouter;