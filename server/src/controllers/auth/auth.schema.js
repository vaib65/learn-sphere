import {z} from "zod";

export const registerSchema = z.object({
  username: z.string().trim().min(3, "Username is too short "),
  email: z.string().trim().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(8, "Invalid password"),
});
