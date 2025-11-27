import express from "express";
const router = express.Router();
import { basicAuth } from "../middleware/auth.js";
import eventController from "../controllers/event.controller.js";

router.post("/initialize", basicAuth, eventController.initializeEvent);

router.get("/status/:eventId", basicAuth, eventController.getEventStatus);

export default router;
