import { Request, Response } from "express";
import * as userService from "../services/userService";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Email validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Check if user already exists
    const existingUser = await userService.authenticateUser(email, password);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    // Create user
    const user = await userService.createUser(email, password);

    // In real-world scenario, you might create a JWT token here
    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error("Register user error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Attempt to authenticate user
    const user = await userService.authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // In a real-world scenario, you'd generate & return a JWT token.
    // For now, we return a success message and user info (minus password).
    return res.status(200).json({
      message: "Login successful",
      user: { id: user._id, email: user.email },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
