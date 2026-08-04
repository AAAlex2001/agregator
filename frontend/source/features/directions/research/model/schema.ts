import { z } from "zod";

export const researchProfileSchema = z.object({
  academic_degree: z.string().trim().max(300, "Не более 300 символов"),
  academic_title: z.string().trim().max(300, "Не более 300 символов"),
  research_field: z.string().trim().max(5000, "Не более 5000 символов"),
});

export const researchOrderSchema = z.object({
  executor_requirements: z.array(z.string()).max(20, "Не более 20 требований к исполнителю"),
  needs_site_visit: z.boolean(),
});
