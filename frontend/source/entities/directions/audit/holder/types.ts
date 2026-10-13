export interface AuditLicenseHolderProfile {
  certificate_number: string;
  accreditation_areas: string[];
}

export const emptyAuditLicenseHolderProfile: AuditLicenseHolderProfile = {
  certificate_number: "",
  accreditation_areas: [],
};
