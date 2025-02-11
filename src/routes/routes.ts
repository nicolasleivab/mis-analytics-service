import { Router } from "express";
import { registerUser, loginUser } from "../controllers/userController";
import { requireAuth } from "../middleware/auth";
import { getSvg } from "../controllers/svgController";

const router = Router();

// user
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);

// svg
router.get("/svg/:id", requireAuth, getSvg);

export default router;
