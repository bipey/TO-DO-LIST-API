import {Todo} from "../models/todos.model.js";

//create todo
const createTodo= async(req,res)=>{
    try {
        const{title, description}=req.body;
        if(!title || !description){
            return res.status(400).json({message:"All fields are required"})
        }
        const getTask= await Todo.findOne({title})
        if(getTask){
            return res.status(400).json({message:`Task with name ${title} already exists`})
        }
        const createTask= await Todo.create({
            title,
            description,
            createdBy:req.user._id
        })
        return res.status(201).json({
            data:{
                title:createTask.title,
                description:createTask.description,
                
            },
            message:"Task created successfully"
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:error.message})
    }
}

//readTodo
export {createTodo}