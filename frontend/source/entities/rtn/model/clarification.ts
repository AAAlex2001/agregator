export type RtnDocumentType = "OFFICIAL_CLARIFICATION" | "INFO_LETTER" | "RESPONSE_TO_REQUEST";
export type RtnStatus = "ACTIVE" | "EXPIRED";
export type RtnReactionValue = "LIKE" | "DISLIKE";

export interface RtnFile {
  name: string;
  url: string;
}

export interface RtnOption {
  value: string;
  label: string;
}

export interface RtnTaxonomy {
  document_types: RtnOption[];
  statuses: RtnOption[];
  oversight_areas: RtnOption[];
  industries: RtnOption[];
  activities: RtnOption[];
  object_types: RtnOption[];
}

export interface RtnListItem {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  document_type: RtnDocumentType;
  status: RtnStatus;
  letter_number: string;
  department: string;
  source_url: string;
  request_files: RtnFile[];
  response_files: RtnFile[];
  tags: string[];
  published_at: string | null;
}

export interface RtnList {
  items: RtnListItem[];
  has_more: boolean;
}

export interface RtnListQuery {
  filters: string;
  limit: number;
  offset: number;
}

export interface RtnRegulationLink {
  label: string;
  url: string;
}

export interface RtnDetail extends RtnListItem {
  question_text: string;
  answer_html: string;
  referenced_regulations: RtnRegulationLink[];
  oversight_areas: RtnOption[];
  industries: RtnOption[];
  activities: RtnOption[];
  object_types: RtnOption[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  updated_at: string;
  views_count: number;
  likes_count: number;
  dislikes_count: number;
}

export interface RtnReactionState {
  likes_count: number;
  dislikes_count: number;
  views_count: number;
  my_reaction: RtnReactionValue | null;
}
