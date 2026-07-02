import { z } from "zod";
import { isValidRussianPhone } from "@/source/shared/lib/phone";
import { TYPES, type ExpertiseType } from "@/source/entities/expertise";

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
    expertConfirmed: z.boolean(),
    expertCertificates: z.array(
      z.object({
        area: z.string(),
        object: z.string(),
        category: z.string(),
      }),
    ),
    showOnMap: z.boolean(),
    mapFields: z.array(z.string()),
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

    if (data.role === "EXPERT") {
      if (!data.firstName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["firstName"], message: "Укажите имя" });
      }
      if (!data.lastName) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["lastName"], message: "Укажите фамилию" });
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
      if (!data.licenseNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["licenseNumber"],
          message: "Укажите номер лицензии",
        });
      }
      if (!data.licenseAreas.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["licenseAreas"],
          message: "Выберите хотя бы один объект экспертизы",
        });
      }
      if (data.rentalKind === "PERCENT") {
        const num = Number(data.rentalPercent.replace(",", "."));
        if (!data.rentalPercent || !Number.isFinite(num) || num <= 0 || num > 100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["rentalPercent"],
            message: "Укажите процент от 0 до 100",
          });
        }
      }
      if (data.rentalKind === "FIXED") {
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
  expertConfirmed: false,
  expertCertificates: [],
  showOnMap: true,
  mapFields: ["name", "area", "object", "category"],
};

export const registerConfirmSchema = z.object({
  code: z.string().regex(/^\d{6}$/u, "Введите 6-значный код"),
});
export type RegisterConfirmValues = z.infer<typeof registerConfirmSchema>;
