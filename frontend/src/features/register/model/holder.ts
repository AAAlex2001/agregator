import type { AuditHolderProfileValues } from "@/entities/audit";
import type { DirectionCode } from "@/entities/direction";
import type { ExpertiseType } from "@/entities/expertise";
import type { LicenseRentalKind } from "@/entities/license-holder";
import type { SroProfileValues } from "@/entities/sro";
import type { TechDiagHolderProfile } from "@/entities/tech-diag";
import type { LocalFile } from "@/shared/lib/local-file";

/** Лицензия ЭПБ: номер, объекты экспертизы, цена предоставления и выбранный файл. */
export interface LicenseRegistration {
  enabled: boolean;
  number: string;
  areas: ExpertiseType[];
  rentalKind: LicenseRentalKind;
  rentalPercent: string;
  rentalFixed: string;
  file: LocalFile | null;
}

/** Необязательные разрешительные документы держателя и их номера. */
export interface RegulatoryDocuments {
  miningNumber: string;
  miningFile: LocalFile | null;
  sroDesignFile: LocalFile | null;
  sroSurveyFile: LocalFile | null;
  laboratoryNumber: string;
  laboratoryFile: LocalFile | null;
}

/** Направления держателя лицензии, членство СРО и документы организации. */
export interface HolderRegistration {
  directions: DirectionCode[];
  license: LicenseRegistration;
  regulatoryDocuments: RegulatoryDocuments;
  audit: AuditHolderProfileValues | null;
  techDiag: TechDiagHolderProfile | null;
  design: SroProfileValues | null;
  survey: SroProfileValues | null;
}

/** Создаёт анкету держателя с оплатой лицензии в процентах по умолчанию. */
export function createHolderRegistration(): HolderRegistration {
  return {
    directions: [],
    license: {
      enabled: false,
      number: "",
      areas: [],
      rentalKind: "PERCENT",
      rentalPercent: "",
      rentalFixed: "",
      file: null,
    },
    regulatoryDocuments: {
      miningNumber: "",
      miningFile: null,
      sroDesignFile: null,
      sroSurveyFile: null,
      laboratoryNumber: "",
      laboratoryFile: null,
    },
    audit: null,
    techDiag: null,
    design: null,
    survey: null,
  };
}

