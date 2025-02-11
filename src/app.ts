import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(cookieParser());

// Middleware
app.use(express.json());

// Routes
app.use("/api", routes);

export default app;
