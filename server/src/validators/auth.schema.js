import {z} from "zod";

export const registerSchema = z.object({
  username: z.string().min(3, "Username is too short "),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8,"Invalid Password"),
});
