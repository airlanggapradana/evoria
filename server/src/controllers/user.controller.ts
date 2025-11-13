import {Router} from "express";
import {authMiddleware} from "../middlewares/auth.middleware";
import {getMe} from "../services/user.service";

const userRouter = Router();

userRouter.get('/me', authMiddleware, getMe)

export default userRouter;