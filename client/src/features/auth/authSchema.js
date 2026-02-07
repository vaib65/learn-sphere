import { z } from "zod";
export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(8, "Invalid password"),
});
