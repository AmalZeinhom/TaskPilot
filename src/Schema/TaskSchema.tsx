import z from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is Required!")
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .refine((val) => !/\s{2,}/.test(val), {
      message: "Name cannot contain multiple consecutive spaces"
    }),
  description: z.string().max(500).optional(),
  project_id: z.string(),
  epic_id: z.string().optional().nullable(),
  assignee_id: z.string().optional().nullable(),
  due_date: z.string().nullable().optional(),
  status: z.enum([
    "TO_DO",
    "IN_PROGRESS",
    "BLOCKED",
    "IN_REVIEW",
    "READY_FOR_QA",
    "REOPENED",
    "READY_FOR_PRODUCTION",
    "DONE"
  ])
});
