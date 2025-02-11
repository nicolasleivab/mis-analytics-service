import { Request, Response } from "express";
// import * as userService from "../services/userService";

export const getSvg = async (req: Request, res: Response) => {
  try {
    const { id: userId } = req.params;

    // Basic validation
    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    // Get user data mock up res json
    return res.status(200).json({
      message: "SVG data",
      svg: "<svg></svg>",
    });
  } catch (error) {
    console.error("Get SVG error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
