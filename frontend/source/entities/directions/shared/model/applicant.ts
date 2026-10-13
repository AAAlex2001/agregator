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

export function pickApplicant(source: ApplicantBlock): ApplicantBlock {
  return {
    applicant_full_name: source.applicant_full_name,
    applicant_position: source.applicant_position,
    applicant_organization: source.applicant_organization,
    applicant_inn: source.applicant_inn,
    applicant_phone: source.applicant_phone,
    applicant_email: source.applicant_email,
  };
}
