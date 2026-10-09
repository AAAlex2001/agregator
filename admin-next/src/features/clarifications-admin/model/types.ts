import type {
  ClarificationStatus,
  DocumentFile,
  DocumentType,
  PublicationStatus,
  RegulationLink,
  Taxonomy,
} from "@/entities/clarification";
import type { Tag } from "@/entities/tag";

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

export type TaxonomyDimension = "oversightAreas" | "industries" | "activities" | "objectTypes";

export type ClarificationFields = {
  documentType: DocumentType;
  status: ClarificationStatus;
  publicationStatus: PublicationStatus;
  slug: string;
  title: string;
  excerpt: string;
  questionText: string;
  answerHtml: string;
  letterNumber: string;
  department: string;
  sourceUrl: string;
  requestFiles: DocumentFile[];
  responseFiles: DocumentFile[];
  referencedRegulations: RegulationLink[];
  tags: string[];
  oversightAreas: string[];
  industries: string[];
  activities: string[];
  objectTypes: string[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  publishedAt: string | null;
};

export type ListState = {
  filter: string;
  list: ClarificationList | null;
  loading: boolean;
  failed: boolean;
};

export type ListAction =
  | { type: "load/start"; filter: string }
  | { type: "load/success"; list: ClarificationList }
  | { type: "load/error" };

export type EditorState = {
  status: "loading" | "ready" | "failed";
  clarification: Clarification | null;
  fields: ClarificationFields;
  tags: Tag[];
  taxonomy: Taxonomy | null;
  pending: boolean;
  confirming: boolean;
};

export type EditorAction =
  | { type: "load/success"; clarification: Clarification | null; tags: Tag[]; taxonomy: Taxonomy }
  | { type: "load/error" }
  | { type: "fields/change"; changes: Partial<ClarificationFields> }
  | { type: "save/start" }
  | { type: "save/finish" }
  | { type: "remove/ask" }
  | { type: "remove/cancel" };
