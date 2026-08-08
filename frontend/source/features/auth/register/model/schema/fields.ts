import { z } from "zod";
import { isValidRussianPhone } from "@/source/shared/lib/phone";
import { TYPES, type ExpertiseType } from "@/source/entities/expertise";
import type {
  AuditCustomerProfile,
  AuditExpertProfile,
  AuditLicenseHolderProfile,
} from "@/source/features/directions/audit";
import type { CadastralProfile } from "@/source/features/directions/cadastral";
import type { ExpertiseProfile } from "@/source/features/directions/expertise";
import type { ForensicProfile } from "@/source/features/directions/forensic";
import type { LaboratoryProfile } from "@/source/features/directions/laboratory";
import type { ResearchProfile } from "@/source/features/directions/research";

const passwordSchema = z
  .string()
  .min(6, "Пароль должен быть не менее 6 символов")
  .regex(/[A-Z]/, "Пароль должен содержать заглавную латинскую букву")
  .regex(/[a-z]/, "Пароль должен содержать строчную латинскую букву")
  .regex(/^[A-Za-z0-9!@#$%^&*()\-_+=\[\]{}|;:'",.<>?/`~ ]+$/, "Только латинские буквы, цифры и спецсимволы");

const expertiseTypeSchema = z.custom<ExpertiseType>(
  (val) => typeof val === "string" && TYPES.includes(val as ExpertiseType),
  "Недопустимый код области",
);

export const registerFormFields = z.object({
  role: z.enum(["CUSTOMER", "EXPERT", "LICENSE_HOLDER"]),
  email: z.string().trim().email("Укажите корректный email"),
  phone: z
    .string()
    .trim()
    .refine((v) => v === "" || isValidRussianPhone(v), "Укажите корректный номер в формате +7-999-999-99-12"),
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  password: passwordSchema,
  repeatPassword: z.string(),
  agreePrivacy: z.boolean(),
  agreeTerms: z.boolean(),
  agreeConsent: z.boolean(),
  companyName: z.string().trim(),
  companyData: z
    .object({
      value: z.string(),
      unrestricted_value: z.string(),
      data: z
        .object({
          inn: z.string().nullable().optional(),
        })
        .passthrough(),
    })
    .passthrough()
    .nullable(),
  expertiseProfile: z.custom<ExpertiseProfile | null>(),
  auditExpertProfile: z.custom<AuditExpertProfile | null>(),
  auditCustomerProfile: z.custom<AuditCustomerProfile | null>(),
  auditLicenseHolderProfile: z.custom<AuditLicenseHolderProfile | null>(),
  cadastralProfile: z.custom<CadastralProfile | null>(),
  forensicProfile: z.custom<ForensicProfile | null>(),
  researchProfile: z.custom<ResearchProfile | null>(),
  laboratoryProfile: z.custom<LaboratoryProfile | null>(),
  licenseEnabled: z.boolean(),
  licenseNumber: z.string().trim(),
  licenseAreas: z.array(expertiseTypeSchema),
  licenseFileName: z.string(),
  rentalKind: z.enum(["PERCENT", "FIXED", "NEGOTIABLE"]),
  rentalPercent: z.string().trim(),
  rentalFixedAmount: z.string().trim(),
  miningLicenseNumber: z.string().trim().max(100),
  labAccreditationNumber: z.string().trim().max(100),
  locationLat: z.number().nullable(),
  locationLng: z.number().nullable(),
  locationAddress: z.string(),
  locationCity: z.string().nullable(),
  travelsToOtherRegions: z.boolean(),
  showOnMap: z.boolean(),
  mapFields: z.array(z.string()),
  contactSalesEnabled: z.boolean(),
  contactPriceRubles: z.string().trim(),
  contactPaymentDetails: z.string().trim().max(1000),
  contactDisclosureConsent: z.boolean(),
});

export type RegisterFormValues = z.infer<typeof registerFormFields>;
