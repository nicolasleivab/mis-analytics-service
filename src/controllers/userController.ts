import { Request, Response } from "express";
import * as userService from "../services/userService";
import { validateEmail, validatePassword } from "../utils/form-utils";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { User } from "../models/userModel";

/**
 * POST /users
 * Registers a new user
 */
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Email validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const isEmailValid = validateEmail(email);

    if (!isEmailValid) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    const isExistingUser = await userService.isExistingUser(email);

    if (isExistingUser) {
      return res.status(409).json({ message: "User already exists." });
    }

    const passwordValidationMsg = validatePassword(password);

    if (passwordValidationMsg.message !== null) {
      return res.status(400).json({ message: passwordValidationMsg.message });
    }

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

/**
 * POST /users
 * Logins in a user
 */
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

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const userWithProjects = await User.findById(user._id).lean();

    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        projects: userWithProjects?.projects || [],
      },
      accessToken,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * GET /users
 * Retrieves the current user
 */
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.sub;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized, no userId" });
    }

    // Query the DB for the user
    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return user data. Avoid returning password hashes/sensitive info if present.
    return res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        projects: user.projects || [],
      },
    });
  } catch (error) {
    console.error("Get current user error:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

/**
 * POST /users
 * Refreshes the access token
 */
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET!);
    // Decoded userId
    const userId = (decoded as jwt.JwtPayload).sub;

    const user = await User.findById(userId).lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id.toString());

    // Rotate the refresh token to mitigate replay attacks.
    const newRefreshToken = generateRefreshToken(user._id.toString());

    // Set new tokens as cookies
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // If rotating refresh token:
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Return new tokens if you want to confirm in the client
    return res.status(200).json({
      message: "Token refreshed",
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return res
      .status(401)
      .json({ message: "Invalid or expired refresh token" });
  }
};

/**
 * POST /users
 * Logs out the user
 */
export const logoutUser = (req: Request, res: Response) => {
  // Clear the cookies:
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res.status(200).json({ message: "Logged out" });
};
