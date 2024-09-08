import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'
export const verifyToken = async(req, res, next) => {
    try {
        const token= req.cookies.accessToken ||req.headers?.authorization?.replace("Bearer ","")
        
        if(!token){
            return res.status(401).json("User not authenticated")
        }
        const decodedToken= jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        if(!decodedToken){
            return res.status(401).json("Credentials not valid")
        }
        const user= await User.findById(decodedToken._id)
        if(!user){
            return res.status(401).json("User not found")
        }
        req.user=user
        
        next()
        
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:error})
    }
}