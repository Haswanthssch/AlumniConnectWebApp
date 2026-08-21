import express from 'express';
import { isAuth } from '../middlewares/isAuth.js';
import { getAllChats, getMessages, sendMessage } from '../controllers/messageControllers.js';

const router = express.Router();

router.get("/chats", isAuth, getAllChats);
router.post("/send", isAuth, sendMessage);
router.get("/:chatId", isAuth, getMessages);

export default router;
