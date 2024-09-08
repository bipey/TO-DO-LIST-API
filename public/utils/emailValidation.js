import { validate } from "email-validator";
const emailValidation=(email)=>{
    const isValid=validate(email)
    if(!isValid){
        return "Invalid email"
    }
    return null
}
export {emailValidation}