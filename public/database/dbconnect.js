import mongoose from "mongoose";
import 'dotenv/config';

export const dbconnect=async(req,res)=>{
    try {
        const conn=await mongoose.connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
        if(!conn){
            console.log("Database connection failed")
        }
        console.log("Database connected successfully") 
    } catch (error) {
        return res.status(500).json({message:`error occured while connecting to dabatase ${error.message}`})
    }
}