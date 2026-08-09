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
