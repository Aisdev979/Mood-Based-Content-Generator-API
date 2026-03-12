import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import contentRoutes from "./routes/content.routes.js";
import { authRouter } from "./routes/auth.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./utilis/swagger.js";


dotenv.config();

const app = express();

// Allowing all origin and allow credentials (like cookies or auth headers) too:
app.use(cors({
  origin: "*", // allow all origins
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Homepage
 *     summary: Homepage route
 *     description: Test route to make sure backend is running
 *     responses:
 *       200:
 *         description: Returns welcome message
 */
app.get("/", (req, res) => {
    res.status(200).send("Hello world!")
})

// Routes
app.use("/api/v1", contentRoutes);
app.use("/api/v1", authRouter);

// Error Handler (must be last)
app.use(errorMiddleware);

export default app;