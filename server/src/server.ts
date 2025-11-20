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
import {rateLimit} from 'express-rate-limit'

const app: Application = express();

app.use(cors(
  {
    origin: ["https://locketix.vercel.app", "http://localhost:3000"],
    credentials: true,
  }
));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
  ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
}));

app.use('/api/auth', authRouter);
app.use('/api/event', eventRouter);
app.use('/api/registration', registrationRouter);
app.use('/api/user', userRouter);
app.use('/api/organizer', organizerRouter)

app.use(errorHandler)

app.listen(env.PORT, () => {
  console.log(`Server is running on port ${env.PORT}`);
});