import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import csrf from "csurf";

dotenv.config();

const app = express();
app.use(cookieParser());

// Configure csrf middleware.
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  },
});

app.use(csrfProtection);

const allowedOrigins = [
  "http://localhost:3000", // Dev frontend
];

// const allowedOrigins = process.env.NODE_ENV === "production"
//    ? ["https://www.frontend.com"]
//    : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // allow cookies to be sent
  })
);

// Middleware
app.use(express.json());

// Routes
app.use("/api", routes);

// Error handling for csurf
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err.code === "EBADCSRFTOKEN") {
      // CSRF token errors here
      return res.status(403).json({ message: "Invalid CSRF token" });
    }
    next(err);
  }
);

export default app;
