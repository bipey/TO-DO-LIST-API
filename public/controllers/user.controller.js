import { connections } from "mongoose";
import { User } from "../models/user.model.js"
import { validate } from "email-validator";
import cookieParser from "cookie-parser";
//register user controller
const register = async (req, res) => {
    try {
        const { firstName, lastName, email, userName, password, confirmPassword } = req.body;
        console.log(firstName, lastName, email, userName, password, confirmPassword)
        if (!firstName || !lastName || !email || !userName || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" })
        }
        const isValid = validate(email)
        if (!isValid) {
            return res.status(400).json("Invalid email")
        }
        const checkUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { userName: userName.toLowerCase() }
            ]
        })
        if (checkUser) {
            return res.status(400).json("User already exists")
        }
        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Password and confirm password do not match" });
        }
        if (password.length < 8) {
            return res.status(400).json("Password must be at least 8 characters long")
        }
        const createUser = await User.create({
            firstName: firstName.charAt(0).toUpperCase() + firstName.toLowerCase().slice(1),
            lastName: lastName.charAt(0).toUpperCase() + lastName.toLowerCase().slice(1),
            email: email.toLowerCase(),
            password,
            userName: userName.toLowerCase(),
        })
        if (!createUser) {
            res.status(300).json("Something went wrong")
        }
        const getUser = await User.findById(createUser._id).select("-password")

        return res.status(201).json({ message: "User created successfully", data: getUser })
    }

    catch (error) {
        return res.status(500).json({ message: error.message })
    }

}



//login user
const login = async (req, res) => {
    try {
        const { email, userName, password } = req.body
        if (!(email || userName) || !password) {
            return res.status(400).json("All fields are required")
        }
        const getUser = await User.findOne({
            $or: (
                [
                    {
                        email: email
                    },
                    {
                        userName: userName
                    }
                ])
        })
        if(!getUser){
            return res.status(400).json("User is not registered")
        }
        const comparePw= getUser.comparePassword(password)
        if(!comparePw){
            return res.status(400).json("Credentials didn't match")
        }
        const {accessToken,refreshToken}=await getUser.generateTokens()
        // console.log(accessToken,refreshToken)
        if(!accessToken||!refreshToken){
            return res.status(401).json("Tokens not generated")
        }
        getUser.refreshToken=refreshToken
        await getUser.save()
        return res.status(200).
        cookie("accessToken",accessToken)
        .cookie("refreshToken",refreshToken)
        .json({data:{firstname:getUser.firstName, lastName:getUser.lastName}, message:`welcome ${getUser.firstName}`})
    
    } catch (error) {
        return res.status(500).json({message:`${error.message}`})
    }
}


//logout user
const logout= async (req,res)=>{
    const {accessToken,refreshToken}=req.cookies
    if(!accessToken||!refreshToken){
        console.log("No user Found")
        return res.status(400).json("No user Found")
    }
  
    const getUser= await User.findById(req.user._id)
    if(!getUser){
        console.log("User not authenticated")
        return res.status(400).json("User not authenticated")
    }
    getUser.refreshToken=undefined
    await getUser.save()
    return res.status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json("User logged out")
}
export { register, login, logout }