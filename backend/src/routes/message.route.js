import express from "express";
import {protectRoute} from "../middlewares/auth.middleware.js"
import {getUsersForSideBar, getMessages, sendMessage, deleteMessage} from "../controllers/message.controller.js"
const router = express.Router();

router.get('/users', protectRoute, getUsersForSideBar);

router.post('/send/:id', protectRoute, sendMessage);
router.delete('/delete/:id', protectRoute, deleteMessage);
router.get('/:id', protectRoute, getMessages)
export default router;
