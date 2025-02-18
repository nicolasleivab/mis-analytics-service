import { Request, Response } from "express";
import {
  createProjectForUser,
  getProject,
  deleteProject,
} from "../services/projectService";

/**
 * POST /projects
 * Creates a new project for the logged-in user.
 */
export const createNewProject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      name,
      idField,
      svgJson,
      clipPathsJson,
      data,
      variableFields,
      svgThresholds,
    } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Project name is required." });
    }

    const newProj = await createProjectForUser(
      userId,
      name,
      idField,
      svgJson,
      clipPathsJson,
      data,
      variableFields,
      svgThresholds
    );

    return res.status(201).json({
      message: "Project created successfully",
      project: newProj,
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * GET /projects/:projectId
 * Retrieves full details of a single project (if owned by the user).
 */
export const getSingleProject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { projectId } = req.params;
    const project = await getProject(projectId, userId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({ project });
  } catch (error) {
    console.error("Get Project Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * DELETE /projects/:projectId
 * Deletes a project, removing both from the Project collection and the user's array.
 */
export const deleteSingleProject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { projectId } = req.params;
    const deleted = await deleteProject(projectId, userId);
    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Project not found or not owned by user" });
    }

    return res
      .status(200)
      .json({ message: "Project deleted successfully", id: projectId });
  } catch (error) {
    console.error("Delete Project Error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
