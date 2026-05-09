import { fetchBase } from "@/source/shared/api/base";
import { API_URL } from "@/source/shared/api/config";
import { stableMultipartFetch } from "@/shared/lib/stableMultipartFetch";
import { toRussianPhoneApiValue } from "@/source/shared/lib/phone";
import type { LicenseHolderRegisterPayload } from "@/source/entities/user";
import type { RegisterApiPayload, RegisterResponse } from "../model/types";
import type { RegisterFormValues } from "../model/schema";

export function toRegisterPayload(values: RegisterFormValues): RegisterApiPayload {
  const role = values.role;
  return {
    role,
    email: values.email.trim(),
    password: values.password,
    phone: toRussianPhoneApiValue(values.phone) || undefined,
    first_name: values.firstName || undefined,
    last_name: values.lastName || undefined,
    inn: role === "CUSTOMER" ? (values.companyData?.data?.inn ?? "") : undefined,
    company_data: role === "CUSTOMER"
      ? (values.companyData as Record<string, unknown> | null)
      : null,
  };
}

export function toLicenseHolderPayload(values: RegisterFormValues): LicenseHolderRegisterPayload {
  return {
    email: values.email.trim(),
    password: values.password,
    phone: toRussianPhoneApiValue(values.phone),
    inn: values.companyData?.data?.inn ?? "",
    company_data: values.companyData as Record<string, unknown>,
    license_number: values.licenseNumber.trim(),
    license_areas: values.licenseAreas,
    license_rental_kind: values.rentalKind,
    license_rental_percent:
      values.rentalKind === "PERCENT" ? Number(values.rentalPercent.replace(",", ".")) : undefined,
    license_rental_fixed_amount:
      values.rentalKind === "FIXED" ? Number(values.rentalFixedAmount.replace(/\s/g, "")) : undefined,
  };
}

export async function registerUser(payload: RegisterApiPayload): Promise<RegisterResponse> {
  return fetchBase<RegisterResponse>("/register/", {
    method: "POST",
    body: {
      role: payload.role,
      email: payload.email,
      password: payload.password,
      phone: payload.phone,
      first_name: payload.first_name,
      last_name: payload.last_name,
      inn: payload.inn,
      company_data: payload.company_data,
    },
  });
}

export async function registerLicenseHolder(
  payload: LicenseHolderRegisterPayload,
  licenseFile: File | null,
): Promise<RegisterResponse> {
  const res = await stableMultipartFetch({
    input: `${API_URL}/register/license-holder`,
    method: "POST",
    files: licenseFile ? [licenseFile] : [],
    buildBody: (files) => {
      const formData = new FormData();
      formData.append("payload", JSON.stringify(payload));
      if (files[0]) formData.append("license_file", files[0]);
      return formData;
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const detail =
      typeof body?.detail === "string"
        ? body.detail
        : Array.isArray(body?.detail) && body.detail[0]?.msg
          ? String(body.detail[0].msg)
          : "Не удалось зарегистрироваться";
    throw new Error(detail);
  }
  return res.json();
}

export { confirmEmailCode as confirmRegistrationEmail } from "@/source/shared/api/emailVerification";
