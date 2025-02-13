import express from "express";
import dotenv from "dotenv";
import routes from "./routes/routes";
import cookieParser from "cookie-parser";
import cors from "cors";
// import csrf from "csurf";

dotenv.config();

const app = express();
app.use(cookieParser());

// Configure csrf middleware.
// This will set a _csrf secret in a cookie, and expect a matching token
// in the request (header, body, or query) on all non-GET requests.
// const csrfProtection = csrf({
//     cookie: {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict", // 'strict' or 'lax'
//       // If you're only serving over HTTPS in production, keep `secure: true`
//     },
//   });

//   app.use(csrfProtection);

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

export default app;
