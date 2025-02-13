import { Router } from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  refreshToken,
  logoutUser,
} from "../controllers/userController";
import { requireAuth } from "../middleware/auth";
import {
  createNewProject,
  deleteSingleProject,
  getSingleProject,
} from "../controllers/projectController";

const router = Router();

// Users
router.post("/users/register", registerUser);
router.post("/users/login", loginUser);
router.get("/users/me", requireAuth, getCurrentUser);
router.post("/users/refresh", refreshToken);
router.post("/users/logout", logoutUser);

// Projects
router.post("/projects", requireAuth, createNewProject);
router.get("/projects/:projectId", requireAuth, getSingleProject);
router.delete("/projects/:projectId", requireAuth, deleteSingleProject);

export default router;
