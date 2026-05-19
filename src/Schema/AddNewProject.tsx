import z from "zod";

export const addProjectSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Project Title is Required!" })
    .min(3, { message: "Project Title must be at  3 characters" })
    .max(50, { message: "Project Title must be at most 50 characters" })
    .refine((val) => !/\s{2,}/.test(val), {
      message: "Name cannot contain multiple consecutive spaces"
    }),
  description: z.string().max(500, { message: "Message must be at most 500 characters" }).optional()
});
