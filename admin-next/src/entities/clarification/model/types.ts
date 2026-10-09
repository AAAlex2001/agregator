import type { BadgeTone } from "@/shared/ui/badge";

export type DocumentType = "OFFICIAL_CLARIFICATION" | "INFO_LETTER" | "RESPONSE_TO_REQUEST";

export type ClarificationStatus = "ACTIVE" | "EXPIRED";

export type PublicationStatus = "DRAFT" | "PUBLISHED";

export type RegulationLink = {
  label: string;
  url: string;
};

export type DocumentFile = {
  name: string;
  url: string;
};

export type TaxonomyOption = {
  value: string;
  label: string;
};

export type Taxonomy = {
  oversight_areas: TaxonomyOption[];
  industries: TaxonomyOption[];
  activities: TaxonomyOption[];
  object_types: TaxonomyOption[];
  document_types: TaxonomyOption[];
  statuses: TaxonomyOption[];
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  OFFICIAL_CLARIFICATION: "Официальное разъяснение",
  INFO_LETTER: "Информационное письмо",
  RESPONSE_TO_REQUEST: "Ответ на обращение",
};

export const CLARIFICATION_STATUS_LABELS: Record<ClarificationStatus, string> = {
  ACTIVE: "Действует",
  EXPIRED: "Утратило силу",
};

export const CLARIFICATION_STATUS_TONES: Record<ClarificationStatus, BadgeTone> = {
  ACTIVE: "success",
  EXPIRED: "neutral",
};

export const PUBLICATION_STATUS_LABELS: Record<PublicationStatus, string> = {
  DRAFT: "Черновик",
  PUBLISHED: "Опубликовано",
};

export const PUBLICATION_STATUS_TONES: Record<PublicationStatus, BadgeTone> = {
  DRAFT: "neutral",
  PUBLISHED: "success",
};
