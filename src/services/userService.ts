import bcrypt from "bcrypt";
import { User, IUser } from "../models/userModel";

const SALT_ROUNDS = 10;

/**
 * Create a new user with hashed password.
 * @param email
 * @param password
 */
export const createUser = async (
  email: string,
  password: string
): Promise<IUser> => {
  // Hash the password before saving to DB
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  const newUser = new User({
    email,
    password: hashedPassword,
  });

  return newUser.save();
};

/**
 * Find a user by email and compare password.
 * @param email
 * @param password
 */
export const authenticateUser = async (
  email: string,
  password: string
): Promise<IUser | null> => {
  const user = await User.findOne({ email });

  if (!user) {
    return null;
  }

  // Compare the provided password with stored hash
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return null;
  }

  return user;
};

/**
 * Does email exist in the database?
 * @param email
 */
export const isExistingUser = async (email: string): Promise<boolean> => {
  const user = await User.findOne({ email });
  return !!user;
};

/**
 * Find a user by ID.
 * @param userId
 */
export const findUserById = async (userId: string): Promise<IUser | null> => {
  return User.findById(userId);
};
