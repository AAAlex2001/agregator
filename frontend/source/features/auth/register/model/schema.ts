import { z } from "zod";
import type { AuthPreset } from "@/source/shared/lib/auth-modal";
import { isValidRussianPhone } from "@/source/shared/lib/phone";
import { TYPES, type ExpertiseType } from "@/source/entities/expertise";
import {
  auditCustomerProfileSchema,
  auditExpertProfileSchema,
  auditLicenseHolderProfileSchema,
  type AuditCustomerProfile,
  type AuditExpertProfile,
  type AuditLicenseHolderProfile,
} from "@/source/features/directions/audit";
import { cadastralProfileSchema, type CadastralProfile } from "@/source/features/directions/cadastral";
import { expertiseProfileSchema, type ExpertiseProfile } from "@/source/features/directions/expertise";
import { forensicProfileSchema, type ForensicProfile } from "@/source/features/directions/forensic";
import { laboratoryProfileSchema, type LaboratoryProfile } from "@/source/features/directions/laboratory";
import { researchProfileSchema, type ResearchProfile } from "@/source/features/directions/research";
import { firstSchemaError } from "@/source/features/directions/shared/model/validate";

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

export const registerFormSchema = z
  .object({
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
    expertiseProfile: z.custom<ExpertiseProfile | null>(),
    auditExpertProfile: z.custom<AuditExpertProfile | null>(),
    auditCustomerProfile: z.custom<AuditCustomerProfile | null>(),
    auditLicenseHolderProfile: z.custom<AuditLicenseHolderProfile | null>(),
    cadastralProfile: z.custom<CadastralProfile | null>(),
    forensicProfile: z.custom<ForensicProfile | null>(),
    researchProfile: z.custom<ResearchProfile | null>(),
    laboratoryProfile: z.custom<LaboratoryProfile | null>(),
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
  })
  .superRefine((data, ctx) => {
    if (!data.repeatPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["repeatPassword"],
        message: "Повторите пароль",
      });
    } else if (data.password !== data.repeatPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["repeatPassword"],
        message: "Пароли не совпадают",
      });
    }

    if (data.role === "EXPERT" || data.role === "CUSTOMER") {
      if (!data.firstName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["firstName"], message: "Укажите имя" });
      }
      if (!data.lastName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["lastName"], message: "Укажите фамилию" });
      }
    }

    if (data.role === "EXPERT") {
      if (data.contactSalesEnabled) {
        const price = Number(data.contactPriceRubles.replace(/\s/g, ""));
        if (!Number.isInteger(price) || price < 1 || price > 1_000_000) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["contactPriceRubles"],
            message: "Укажите стоимость от 1 до 1 000 000 ₽",
          });
        }
        if (!data.contactPaymentDetails) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["contactPaymentDetails"],
            message: "Укажите реквизиты для прямого перевода",
          });
        }
        if (!data.contactDisclosureConsent) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["contactDisclosureConsent"],
            message: "Подтвердите согласие на передачу контактов после оплаты",
          });
        }
      }
    }

    const needsCompany = data.role === "CUSTOMER" || data.role === "LICENSE_HOLDER";
    if (needsCompany) {
      const inn = data.companyData?.data?.inn ?? "";
      if (!data.companyData || !inn || !/^\d{10}$|^\d{12}$/.test(inn)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["companyName"],
          message: "Выберите вашу организацию из списка",
        });
      }
    }

    if (data.role === "LICENSE_HOLDER") {
      if (!data.licenseEnabled && data.auditLicenseHolderProfile === null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["licenseEnabled"],
          message: "Выберите хотя бы один разрешительный документ",
        });
      }
      const licenseRequired = data.licenseEnabled;
      if (licenseRequired && !data.licenseNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["licenseNumber"],
          message: "Укажите номер лицензии",
        });
      }
      if (licenseRequired && !data.licenseAreas.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["licenseAreas"],
          message: "Выберите хотя бы один объект экспертизы",
        });
      }
      const hasLicense = licenseRequired;
      if (hasLicense && data.rentalKind === "PERCENT") {
        const num = Number(data.rentalPercent.replace(",", "."));
        if (!data.rentalPercent || !Number.isFinite(num) || num <= 0 || num > 100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["rentalPercent"],
            message: "Укажите процент от 0 до 100",
          });
        }
      }
      if (hasLicense && data.rentalKind === "FIXED") {
        const num = Number(data.rentalFixedAmount.replace(/\s/g, ""));
        if (!data.rentalFixedAmount || !Number.isFinite(num) || num <= 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["rentalFixedAmount"],
            message: "Укажите минимальную фиксированную цену",
          });
        }
      }
    }

    const directionChecks = [
      { path: "expertiseProfile", message: data.expertiseProfile && firstSchemaError(expertiseProfileSchema, data.expertiseProfile) },
      { path: "auditExpertProfile", message: data.auditExpertProfile && firstSchemaError(auditExpertProfileSchema, data.auditExpertProfile) },
      { path: "auditCustomerProfile", message: data.auditCustomerProfile && firstSchemaError(auditCustomerProfileSchema, data.auditCustomerProfile) },
      { path: "auditLicenseHolderProfile", message: data.auditLicenseHolderProfile && firstSchemaError(auditLicenseHolderProfileSchema, data.auditLicenseHolderProfile) },
      { path: "cadastralProfile", message: data.cadastralProfile && firstSchemaError(cadastralProfileSchema, data.cadastralProfile) },
      { path: "forensicProfile", message: data.forensicProfile && firstSchemaError(forensicProfileSchema, data.forensicProfile) },
      { path: "researchProfile", message: data.researchProfile && firstSchemaError(researchProfileSchema, data.researchProfile) },
      { path: "laboratoryProfile", message: data.laboratoryProfile && firstSchemaError(laboratoryProfileSchema, data.laboratoryProfile) },
    ];
    for (const check of directionChecks) {
      if (check.message) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: [check.path], message: check.message });
      }
    }

    if (!data.agreePrivacy) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["agreePrivacy"],
        message: "Требуется согласие с Политикой конфиденциальности",
      });
    }
    if (!data.agreeTerms) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["agreeTerms"],
        message: "Требуется согласие с Пользовательским соглашением",
      });
    }
    if (!data.agreeConsent) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["agreeConsent"],
        message: "Требуется согласие на обработку персональных данных",
      });
    }
  });

export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export const emptyRegisterFormValues: RegisterFormValues = {
  role: "CUSTOMER",
  email: "",
  phone: "",
  firstName: "",
  lastName: "",
  password: "",
  repeatPassword: "",
  agreePrivacy: false,
  agreeTerms: false,
  agreeConsent: false,
  companyName: "",
  companyData: null,
  licenseEnabled: true,
  expertiseProfile: null,
  auditExpertProfile: null,
  auditCustomerProfile: null,
  auditLicenseHolderProfile: null,
  cadastralProfile: null,
  forensicProfile: null,
  researchProfile: null,
  laboratoryProfile: null,
  licenseNumber: "",
  licenseAreas: [],
  licenseFileName: "",
  rentalKind: "PERCENT",
  rentalPercent: "",
  rentalFixedAmount: "",
  miningLicenseNumber: "",
  labAccreditationNumber: "",
  locationLat: null,
  locationLng: null,
  locationAddress: "",
  locationCity: null,
  travelsToOtherRegions: false,
  showOnMap: true,
  mapFields: ["name", "area", "object", "category"],
  contactSalesEnabled: false,
  contactPriceRubles: "",
  contactPaymentDetails: "",
  contactDisclosureConsent: false,
};

export function presetRegisterFormValues(preset: AuthPreset): RegisterFormValues {
  const values: RegisterFormValues = { ...emptyRegisterFormValues, role: preset.role };
  if (preset.direction !== "AUDIT_SUPB") return values;
  if (preset.role === "CUSTOMER") values.auditCustomerProfile = { position: "", opo_license_number: "" };
  if (preset.role === "EXPERT") {
    values.auditExpertProfile = {
      industrial_safety_areas: [],
      expert_attestation_areas: [],
      audit_qualifications: [],
      documents: [],
    };
  }
  if (preset.role === "LICENSE_HOLDER") {
    values.auditLicenseHolderProfile = { certificate_number: "", accreditation_areas: [] };
    values.licenseEnabled = false;
  }
  return values;
}

export const registerConfirmSchema = z.object({
  code: z.string().regex(/^\d{6}$/u, "Введите 6-значный код"),
});
export type RegisterConfirmValues = z.infer<typeof registerConfirmSchema>;
