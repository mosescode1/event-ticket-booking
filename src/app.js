import express from "express";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/event.js";
import ticketRoutes from "./routes/ticket.js";
import { rateLimit } from "express-rate-limit";

const app = express();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use(express.json());

app.use(limiter);
app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/tickets", ticketRoutes);

app.use("/*splat", (req, res) => {
  res.status(404).json({
    message: `Route not found`,
    status: 404,
    path: req.originalUrl,
  });
});

export { app };
