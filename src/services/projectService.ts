import { Project } from "../models/projectModel";
import { User } from "../models/userModel";

/**
 * Create a new Project document and add a reference to the user's projects array.
 */
export async function createProjectForUser(
  userId: string,
  name: string,
  idField: string,
  svgJson: any,
  clipPathsJson: any,
  data: any,
  variableFields: any,
  svgThresholds: any
) {
  const newProject = await Project.create({
    user: userId,
    name,
    idField,
    svgJson,
    clipPathsJson,
    data,
    variableFields,
    svgThresholds,
  });

  // Push a reference to the user's projects array
  await User.findByIdAndUpdate(userId, {
    $push: {
      projects: {
        id: newProject._id,
        name: newProject.name,
        createdAt: newProject.createdAt,
        updatedAt: newProject.updatedAt,
      },
    },
  });

  return newProject;
}

/**
 * Update a project by ID
 */
export async function updateProjectForUser(
  projectId: string,
  userId: string,
  name: string,
  idField: string,
  svgJson: any,
  clipPathsJson: any,
  data: any,
  variableFields: any,
  svgThresholds: any
) {
  const updatedProject = await Project.findOneAndUpdate(
    { _id: projectId, user: userId },
    {
      name,
      idField,
      svgJson,
      clipPathsJson,
      data,
      variableFields,
      svgThresholds,
    },
    { new: true }
  );

  if (!updatedProject) return null;

  // Update the project name in the user's projects array
  await User.updateOne(
    { _id: userId, "projects.id": projectId },
    {
      $set: {
        "projects.$.name": name,
        "projects.$.updatedAt": updatedProject.updatedAt,
      },
    }
  );

  return updatedProject;
}

/**
 * Get one project by ID (ensure it belongs to user).
 */
export async function getProject(projectId: string, userId: string) {
  // Make sure user matches so no one can fetch others' projects
  return Project.findOne({ _id: projectId, user: userId });
}

/**
 * Delete a project by ID (also remove it from the user's projects array).
 */
export async function deleteProject(projectId: string, userId: string) {
  // Remove the project from Project collection
  const project = await Project.findOneAndDelete({
    _id: projectId,
    user: userId,
  });
  if (!project) return null;

  // Pull from user's projects array
  await User.findByIdAndUpdate(userId, {
    $pull: {
      projects: { id: projectId },
    },
  });

  return project;
}
