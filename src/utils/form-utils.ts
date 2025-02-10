import { MOST_COMMON_PASSWORDS } from "./constants";

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): { message: string | null } {
  if (password.length < 12) {
    return { message: "Password must be at least 12 characters long." };
  }

  if (!/[A-Z]/.test(password)) {
    return { message: "Password must contain at least one uppercase letter." };
  }

  if (!/[a-z]/.test(password)) {
    return { message: "Password must contain at least one lowercase letter." };
  }

  if (!/\d/.test(password)) {
    return { message: "Password must contain at least one digit." };
  }

  if (!/[^A-Za-z0-9]/.test(password)) {
    return { message: "Password must contain at least one special character." };
  }

  if (
    MOST_COMMON_PASSWORDS.map((p) => p.toLowerCase()).includes(
      password.toLowerCase()
    )
  ) {
    return { message: "Password is too common." };
  }

  return { message: null };
}
