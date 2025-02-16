import { connectDB } from "./config/db";
import app from "./app";
import dotenv from "dotenv";

const DEFAULT_PORT = 4000;

dotenv.config();

const PORT = Number(process.env.PORT) || DEFAULT_PORT;

connectDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
});
