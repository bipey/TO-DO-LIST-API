import Router from "router";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { createTodo } from "../controllers/task.controller.js";
const router=Router();

router.route("/addTodos").post(verifyToken,createTodo)


export default router;