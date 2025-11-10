import express, {Application} from 'express';
import cors from 'cors';
import authRouter from "./controllers/auth.controller";
import cookieParser from "cookie-parser";
import {errorHandler} from "./middlewares/error-handler";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use('/api/auth', authRouter);

app.use(errorHandler)

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});