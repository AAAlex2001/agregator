import type { ExpertCertificate } from "@/source/entities/expertise";

export interface ExpertiseProfile {
  certificates: ExpertCertificate[];
}

export const emptyExpertiseProfile: ExpertiseProfile = {
  certificates: [],
};
