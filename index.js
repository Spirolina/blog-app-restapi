import express from 'express'
import { login_post } from './controllers/UserController.js';
import bodyParser from 'body-parser';
import cors from 'cors'
import mongoose from 'mongoose';
import apiRouter from './routes/api.js';
import helmet from 'helmet';
import compression from 'compression';
import 'dotenv/config' 

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }
const app = express();
app.use(helmet());
app.use(cors(corsOptions)) 
app.use(compression());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const murl = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.iz1vu.mongodb.net/blogDB?retryWrites=true&w=majority`
console.log(murl);
mongoose.connect(murl,
   );


app.use('/api', apiRouter);
app.get('/', (req, res) => {
    res.send('Hello world')
});

app.post('/', login_post)

app.listen(5000, (req, res) => {
    console.log('Listening at port 5000');
})



