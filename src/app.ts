import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes";
import cookieParser from "cookie-parser";
import cors from "cors";
import csrf from "csurf";

const DEFAULT_FE_URL = "https://www.mis-analytics.org";

dotenv.config();

const app = express();
app.use(cookieParser());

// Get allowed origins from env variable, or use default for dev
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : DEFAULT_FE_URL;

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // allow cookies to be sent
  })
);

const isProduction = process.env.NODE_ENV === "production";

// Configure csrf middleware.
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
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
