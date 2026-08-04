import type { z } from "zod";

export function firstSchemaError(schema: z.ZodTypeAny, value: object): string | null {
  const result = schema.safeParse(value);
  return result.success ? null : result.error.issues[0].message;
}
