import { z } from "zod";

export const laboratoryProfileSchema = z.object({
  accreditation_area: z.string().trim().max(5000, "Не более 5000 символов"),
  comment: z.string().trim().max(5000, "Не более 5000 символов"),
});

export const laboratoryOrderSchema = z.object({
  equipment_requirements: z.string().trim().max(5000, "Не более 5000 символов"),
});
