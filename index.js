import express from "express";
import dotenv from "dotenv";
import contentRoutes from "./routes/content.routes.js";
import { authRouter } from "./routes/auth.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";


dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.json())

// Routes
app.use("/api/v1", contentRoutes);
app.use("/api/v1", authRouter);

app.get("/", (req, res) => {
    res.status(200).send("Hello world!")
})

// Error Handler (must be last)
app.use(errorMiddleware);

export default app;