import express from "express";
import { isAuth } from "../middlewares/isAuth.js";
import { createEvent, deleteEvent, getAllEvents, updateEvent } from "../controllers/eventControllers.js";

const router = express.Router();

router.get("/all", isAuth, getAllEvents);
router.post("/create", isAuth, createEvent);
router.put("/:id", isAuth, updateEvent);
router.delete("/:id", isAuth, deleteEvent);

export default router;
