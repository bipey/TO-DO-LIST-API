import Router from "router";
import { login, logout, register } from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router=Router();
router.route("/").get((req,res)=>{
    res.send("<h1>hello world</h1>");    
})
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(verifyToken,logout)
export default router;