import { fetchBase } from "@/source/shared/api/base";
import { API_URL } from "@/source/shared/api/config";
import { stableMultipartFetch } from "@/source/shared/lib/stableMultipartFetch";
import type { LicenseHolderRegisterPayload } from "@/source/entities/user";
import type { RegisterApiPayload, RegisterResponse } from "@/source/entities/user/model/register";

export async function registerUser(payload: RegisterApiPayload): Promise<RegisterResponse> {
  const result = await fetchBase<RegisterResponse>("/register/", {
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
  if (result === null) throw new Error("Empty response");
  return result;
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
