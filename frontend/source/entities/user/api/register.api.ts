import { fetchBase } from "@/source/shared/api/base";
import { API_URL } from "@/source/shared/api/config";
import { stableMultipartFetch } from "@/source/shared/lib/stableMultipartFetch";
import { toRussianPhoneApiValue } from "@/source/shared/lib/phone";
import type { CompanyData, LicenseHolderRegisterPayload } from "@/source/entities/user";
import type { RegisterApiPayload, RegisterResponse } from "@/source/entities/user/model/register";
// TODO: RegisterFormValues is a Zod-inferred form type — keep temporary coupling to the feature module
// until follow-up cleanup migrates form-values shape into the entity layer.
import type { RegisterFormValues } from "@/source/features/auth/register/model/schema";

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
      ? (values.companyData as CompanyData | null)
      : null,
  };
}

export function toLicenseHolderPayload(values: RegisterFormValues): LicenseHolderRegisterPayload {
  return {
    email: values.email.trim(),
    password: values.password,
    phone: toRussianPhoneApiValue(values.phone),
    inn: values.companyData?.data?.inn ?? "",
    company_data: values.companyData as CompanyData,
    license_number: values.licenseNumber.trim(),
    license_areas: values.licenseAreas,
    license_rental_kind: values.rentalKind,
    license_rental_percent:
      values.rentalKind === "PERCENT" ? Number(values.rentalPercent.replace(",", ".")) : undefined,
    license_rental_fixed_amount:
      values.rentalKind === "FIXED" ? Number(values.rentalFixedAmount.replace(/\s/g, "")) : undefined,
    mining_license_number: values.miningLicenseNumber?.trim() || null,
    sro_design_number: values.sroDesignNumber?.trim() || null,
    lab_accreditation_number: values.labAccreditationNumber?.trim() || null,
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
  miningLicenseFile: File | null = null,
  sroDesignFile: File | null = null,
  labAccreditationFile: File | null = null,
): Promise<RegisterResponse> {
  const allFiles = [licenseFile, miningLicenseFile, sroDesignFile, labAccreditationFile].filter(
    (f): f is File => f !== null,
  );
  const res = await stableMultipartFetch({
    input: `${API_URL}/register/license-holder`,
    method: "POST",
    files: allFiles,
    buildBody: () => {
      const formData = new FormData();
      formData.append("payload", JSON.stringify(payload));
      if (licenseFile) formData.append("license_file", licenseFile);
      if (miningLicenseFile) formData.append("mining_license_file", miningLicenseFile);
      if (sroDesignFile) formData.append("sro_design_file", sroDesignFile);
      if (labAccreditationFile) formData.append("lab_accreditation_file", labAccreditationFile);
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
