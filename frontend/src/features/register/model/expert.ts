import type { AuditExpertProfileValues } from "@/entities/audit";
import type { CadastralProfileValues } from "@/entities/cadastral";
import type { DesignProfileValues } from "@/entities/design";
import type { EcologyProfileValues } from "@/entities/ecology";
import type { ContactOfferFields } from "@/entities/expert-contact";
import type { ExpertiseProfileValues } from "@/entities/expertise";
import type { ForensicProfileValues } from "@/entities/forensic";
import type { LaboratoryProfileValues } from "@/entities/laboratory";
import type { ResearchProfileValues } from "@/entities/research";
import type { SurveyProfileValues } from "@/entities/survey";
import type { TechDiagProfileValues } from "@/entities/tech-diag";
import type { LocalFile } from "@/shared/lib/local-file";
import type { SelectedLocation } from "@/shared/ui/address-picker";

/** Документы проектировщика и изыскателя: в API у каждой группы отдельный код. */
export interface QualificationDocuments {
  education: LocalFile[];
  nok: LocalFile[];
  nrs: LocalFile[];
  qualification: LocalFile[];
  rtn: LocalFile[];
}

/** Выбор аудита и прикреплённые документы; снятая галочка обнуляет только анкету. */
export interface AuditRegistration {
  profile: AuditExpertProfileValues | null;
  documents: LocalFile[];
}

/** Анкета кадастрового инженера с дипломом, аттестатом и прочими документами. */
export interface CadastralRegistration {
  profile: CadastralProfileValues | null;
  diploma: LocalFile | null;
  certificate: LocalFile | null;
  documents: LocalFile[];
}

/** Анкета судебного эксперта с дипломом и дополнительным образованием. */
export interface ForensicRegistration {
  profile: ForensicProfileValues | null;
  diploma: LocalFile | null;
  documents: LocalFile[];
}

/** Анкета специалиста НК и его квалификационные удостоверения. */
export interface TechDiagRegistration {
  profile: TechDiagProfileValues | null;
  documents: LocalFile[];
}

/** Анкета проектировщика и документы по пяти квалификационным группам. */
export interface DesignRegistration {
  profile: DesignProfileValues | null;
  documents: QualificationDocuments;
}

/** Анкета изыскателя и документы по пяти квалификационным группам. */
export interface SurveyRegistration {
  profile: SurveyProfileValues | null;
  documents: QualificationDocuments;
}

/** Анкета эколога с подтверждением квалификации. */
export interface EcologyRegistration {
  profile: EcologyProfileValues | null;
  documents: LocalFile[];
}

/** Место работы исполнителя и выбранные сведения для публичной карты. */
export interface ExpertLocation {
  point: SelectedLocation | null;
  travels: boolean;
  showOnMap: boolean;
  mapFields: string[];
}

/** Все выбранные направления исполнителя и общие настройки его анкеты. */
export interface ExpertRegistration {
  expertise: ExpertiseProfileValues | null;
  audit: AuditRegistration;
  cadastral: CadastralRegistration;
  forensic: ForensicRegistration;
  research: ResearchProfileValues | null;
  laboratory: LaboratoryProfileValues | null;
  techDiag: TechDiagRegistration;
  design: DesignRegistration;
  survey: SurveyRegistration;
  ecology: EcologyRegistration;
  location: ExpertLocation;
  contactOffer: ContactOfferFields;
}

/** Создаёт отдельные массивы документов для нового направления. */
export function createQualificationDocuments(): QualificationDocuments {
  return {
    education: [],
    nok: [],
    nrs: [],
    qualification: [],
    rtn: [],
  };
}

/** Создаёт анкету исполнителя без выбранных направлений. */
export function createExpertRegistration(): ExpertRegistration {
  return {
    expertise: null,
    audit: { profile: null, documents: [] },
    cadastral: { profile: null, diploma: null, certificate: null, documents: [] },
    forensic: { profile: null, diploma: null, documents: [] },
    research: null,
    laboratory: null,
    techDiag: { profile: null, documents: [] },
    design: { profile: null, documents: createQualificationDocuments() },
    survey: { profile: null, documents: createQualificationDocuments() },
    ecology: { profile: null, documents: [] },
    location: {
      point: null,
      travels: false,
      showOnMap: true,
      mapFields: ["name"],
    },
    contactOffer: {
      enabled: false,
      price: "",
      paymentDetails: "",
      consent: false,
    },
  };
}

