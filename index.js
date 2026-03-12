import express from "express";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth.route.js";
//import { seedContent } from "./models/data/seeders/seedContent.js";



dotenv.config()

const app = express();
app.use(express.json())

app.use("/api/v1", authRouter)
app.get("/", (req, res) => {
    res.status(200).send("Hello world!")
})

export default app