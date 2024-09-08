import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        uniquE:true
    },
    
        description:{
            type:String,
            required:true
        },
        status:{
            type:Boolean,
            required:true,
            default:false
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    },
    {
        timestamps:true
    }
)
export const Todo= mongoose.model("Todo",todoSchema)