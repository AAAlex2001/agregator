import { z } from "zod";

export const FILE_ACCEPT_EXT = [
  ".pdf",
  ".jpeg",
  ".jpg",
  ".png",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
] as const;

export const FILE_ACCEPT = FILE_ACCEPT_EXT.join(",");

export const MAX_FILES = 6;
export const MAX_FILE_SIZE = 100 * 1024 * 1024;
export const MAX_SUBJECT_LENGTH = 200;
export const MAX_MESSAGE_LENGTH = 5000;

const fileSchema = z.custom<File>(
  (value) => typeof File !== "undefined" && value instanceof File,
  { message: "Некорректный файл" },
)
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    { message: `Файл больше ${Math.round(MAX_FILE_SIZE / 1024 / 1024)} МБ не поддерживается` },
  )
  .refine(
    (file) => FILE_ACCEPT_EXT.some((ext) => file.name.toLowerCase().endsWith(ext)),
    { message: "Поддерживаются: PDF, JPEG, PNG, DOC, DOCX, XLS, XLSX" },
  );

export const filesSchema = z
  .array(fileSchema)
  .max(MAX_FILES, `Можно прикрепить не больше ${MAX_FILES} файлов`);

export const ticketCategorySchema = z.enum([
  "ORDER",
  "RESPONSE",
  "TECHNICAL",
  "BILLING",
  "ACCOUNT",
  "COMPLAINT",
  "SUGGESTION",
  "OTHER",
]);

export const createTicketSchema = z.object({
  subject: z
    .string()
    .trim()
    .min(1, "Укажите тему обращения")
    .max(MAX_SUBJECT_LENGTH, `Тема не должна превышать ${MAX_SUBJECT_LENGTH} символов`),
  category: ticketCategorySchema,
  message: z
    .string()
    .trim()
    .min(1, "Напишите сообщение")
    .max(MAX_MESSAGE_LENGTH, `Сообщение не должно превышать ${MAX_MESSAGE_LENGTH} символов`),
  files: filesSchema,
});

export type CreateTicketValues = z.infer<typeof createTicketSchema>;

export const ticketReplySchema = z
  .object({
    text: z
      .string()
      .trim()
      .max(MAX_MESSAGE_LENGTH, `Сообщение не должно превышать ${MAX_MESSAGE_LENGTH} символов`),
    files: filesSchema,
  })
  .superRefine((data, ctx) => {
    if (!data.text && data.files.length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["text"],
        message: "Введите сообщение или прикрепите файл",
      });
    }
  });

export type TicketReplyValues = z.infer<typeof ticketReplySchema>;
