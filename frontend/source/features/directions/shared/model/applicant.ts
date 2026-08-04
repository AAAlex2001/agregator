import { z } from "zod";

export interface ApplicantBlock {
  applicant_full_name: string;
  applicant_position: string;
  applicant_organization: string;
  applicant_inn: string;
  applicant_phone: string;
  applicant_email: string;
}

export const emptyApplicant: ApplicantBlock = {
  applicant_full_name: "",
  applicant_position: "",
  applicant_organization: "",
  applicant_inn: "",
  applicant_phone: "",
  applicant_email: "",
};

export const applicantSchema = z.object({
  applicant_full_name: z.string().trim().min(1, "Укажите ФИО представителя заявителя"),
  applicant_position: z.string().trim().max(200, "Не более 200 символов"),
  applicant_organization: z.string().trim().max(500, "Не более 500 символов"),
  applicant_inn: z
    .string()
    .trim()
    .regex(/^$|^\d{10}$|^\d{12}$/, "ИНН должен содержать 10 или 12 цифр"),
  applicant_phone: z.string().trim().min(5, "Укажите контактный телефон"),
  applicant_email: z.string().trim().email("Укажите корректный email"),
});
