import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import csrf from "csurf";

const DEFAULT_LOCAL_FE_URL = "http://localhost:3000";

dotenv.config();

const app = express();
app.use(cookieParser());

// Get allowed origins from env variable, or use default for dev
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : DEFAULT_LOCAL_FE_URL;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // allow cookies to be sent
  })
);

// Configure csrf middleware.
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    domain: "mis-analytics-service.duckdns.org",
  },
});

app.use(csrfProtection);

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
