import { z } from 'zod'

export const courseInputSchema = z.object({
    title: z.string().trim().min(3, "Title too short"),
    description: z.string().trim().min(8, "Description too short"),
    category: z.string().trim().min(5, "At 5 character required"),
}); 