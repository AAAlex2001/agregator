import { z } from "zod";

export const expertiseProfileSchema = z.object({
  certificates: z
    .array(
      z.object({
        area: z.string(),
        object: z.string(),
        category: z.string(),
      }),
    )
    .max(200, "Не более 200 удостоверений"),
});
