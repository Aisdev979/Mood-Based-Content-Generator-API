import express from "express";
import dotenv from "dotenv";
import contentRoutes from "./routes/content.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/content", contentRoutes);

// Error Handler (must be last)
app.use(errorMiddleware);

export default app;