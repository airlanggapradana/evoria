import express, {Application} from 'express';
import cors from 'cors';
import authRouter from "./controllers/auth.controller";
import cookieParser from "cookie-parser";
import {errorHandler} from "./middlewares/error-handler";
import eventRouter from "./controllers/event.controller";
import registrationRouter from "./controllers/registration.controller";
import {env} from "./env";
import userRouter from "./controllers/user.controller";
import organizerRouter from "./controllers/organizer.controller";

const app: Application = express();

app.use(cors(
  {
    origin: env.FRONTEND_URL,
    credentials: true,
  }
));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/event', eventRouter);
app.use('/api/registration', registrationRouter);
app.use('/api/user', userRouter);
app.use('/api/organizer', organizerRouter)

app.use(errorHandler)

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});