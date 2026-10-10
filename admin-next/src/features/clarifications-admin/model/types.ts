import type {
  Clarification,
  ClarificationList,
  ClarificationStatus,
  DocumentFile,
  DocumentType,
  PublicationStatus,
  RegulationLink,
  Taxonomy,
} from "@/entities/clarification";
import type { Tag } from "@/entities/tag";

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
