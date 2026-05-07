import z from "zod";

export const epicSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Epic Title is required!" })
    .min(3, { message: "Epic Title must be at least 3 characters" })
    .max(50, { message: "Epic Title must be at most 50 characters" })
    .refine((val) => !/\s{2,}/.test(val), {
      message: "Name cannot contain multiple consecutive spaces"
    }),
  description: z
    .string()
    .max(500, { message: "Message must be at most 500 characters" })
    .optional(),
  assignee: z.string().optional().nullable(),
  deadline: z.string().nullable().optional()
});
