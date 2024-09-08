import express from 'express';
import 'dotenv/config';
import { dbconnect } from '../database/dbconnect.js';
import userRouter from '../routes/userRoutes.js';
import todoRouter from '../routes/todoRoutes.js';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const app=express();
app.use(bodyParser.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())
const port=process.env.PORT||4000;
dbconnect().then(()=>{
    app.use('/api/user',userRouter)
    app.use("/api/todo",todoRouter)
    app.listen(port,()=>{
        console.log(`Server is listening to http://localhost:${port}/api/user/`);
       
    })
})
.catch((error)=>{
    console.log("Error occured while connecting to database",error.message)
})
