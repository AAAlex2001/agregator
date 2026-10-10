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

export type ClarificationListItem = {
  id: number;
  document_type: DocumentType;
  status: ClarificationStatus;
  publication_status: PublicationStatus;
  title: string;
  slug: string;
  letter_number: string;
  published_at: string | null;
  updated_at: string;
};

export type ClarificationList = {
  items: ClarificationListItem[];
  total: number;
};

export type ClarificationPayload = {
  document_type: DocumentType;
  status: ClarificationStatus;
  publication_status: PublicationStatus;
  slug: string;
  title: string;
  excerpt: string;
  question_text: string;
  answer_html: string;
  letter_number: string;
  department: string;
  source_url: string;
  pdf_url: string;
  response_pdf_url: string;
  request_files: DocumentFile[];
  response_files: DocumentFile[];
  referenced_regulations: RegulationLink[];
  tags: string[];
  oversight_areas: string[];
  industries: string[];
  activities: string[];
  object_types: string[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  published_at: string | null;
  answered_question_id: number | null;
};

export type Clarification = ClarificationPayload & {
  id: number;
  views_count: number;
  created_at: string;
  updated_at: string;
};
