import express from "express";
import { basicAuth } from "../middleware/auth.js";
import ticketController from "../controllers/ticket.controller.js";
const router = express.Router();

router.post("/book", basicAuth, ticketController.bookTicket);
router.post("/cancel", basicAuth, ticketController.cancelTicket);

export default router;
