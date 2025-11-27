import express from "express";
import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/event.js";
import ticketRoutes from "./routes/ticket.js";
import { rateLimit } from "express-rate-limit";
import errorHandler from "./middleware/errorHandler.js";
import ApiError from "./utils/ApiError.js";
import database from "./database/db.js";

const app = express();

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
});

app.use(express.json());

// Apply rate limiter except during tests
if (process.env.NODE_ENV !== "test") {
  app.use(limiter);
}

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);
app.use("/tickets", ticketRoutes);

// 404 forwarding to centralized error handler
app.use((req, res, next) => {
  next(ApiError.notFound("Route not found", { path: req.originalUrl }));
});

// Centralized error handler
app.use(errorHandler);

export { app };
