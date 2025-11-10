import express, {Application} from 'express';
import cors from 'cors';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});