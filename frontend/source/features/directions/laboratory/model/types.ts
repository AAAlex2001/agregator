export interface LaboratoryProfile {
  accreditation_area: string;
  comment: string;
}

export interface LaboratoryOrderDetails {
  equipment_requirements: string;
}

export const emptyLaboratoryProfile: LaboratoryProfile = {
  accreditation_area: "",
  comment: "",
};

export const emptyLaboratoryOrderDetails: LaboratoryOrderDetails = {
  equipment_requirements: "",
};
