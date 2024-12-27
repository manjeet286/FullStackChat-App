import express from "express"
import { protectRoute } from "../midlleware/auth.meddleWare.js";
import { getMessage  ,getUserForSideBar, sendMessage} from "../controllers/message.controller.js";
const router= express.Router();
router.get("/users" ,protectRoute, getUserForSideBar)
router.get("/:id", protectRoute,  getMessage)
router.post("/send/:id", protectRoute,  sendMessage)
export default router