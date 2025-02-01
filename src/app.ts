import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

export default app;
