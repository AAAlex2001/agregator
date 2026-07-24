import { API_URL, SERVER_API_URL } from "@/source/shared/api/config";

export type RtnDocumentType = "OFFICIAL_CLARIFICATION" | "INFO_LETTER" | "RESPONSE_TO_REQUEST";
export type RtnStatus = "ACTIVE" | "EXPIRED";

export interface RtnTaxonomyOption {
  value: string;
  label: string;
}

export interface RtnTaxonomy {
  oversight_areas: RtnTaxonomyOption[];
  industries: RtnTaxonomyOption[];
  activities: RtnTaxonomyOption[];
  object_types: RtnTaxonomyOption[];
  document_types: RtnTaxonomyOption[];
  statuses: RtnTaxonomyOption[];
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
  pdf_url: string;
  tags: string[];
  published_at: string | null;
}

export interface RtnList {
  items: RtnListItem[];
  has_more: boolean;
}

export interface RtnRegulationLink {
  label: string;
  url: string;
}

export interface RtnDetail {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  document_type: RtnDocumentType;
  status: RtnStatus;
  question_text: string;
  answer_html: string;
  letter_number: string;
  department: string;
  source_url: string;
  pdf_url: string;
  referenced_regulations: RtnRegulationLink[];
  tags: string[];
  oversight_areas: RtnTaxonomyOption[];
  industries: RtnTaxonomyOption[];
  activities: RtnTaxonomyOption[];
  object_types: RtnTaxonomyOption[];
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  published_at: string | null;
  updated_at: string;
  views_count: number;
}

export interface RtnListFilters {
  search?: string;
  documentTypes?: RtnDocumentType[];
  statuses?: RtnStatus[];
  oversightAreas?: string[];
  industries?: string[];
  activities?: string[];
  objectTypes?: string[];
  publishedFrom?: string;
  publishedTo?: string;
  limit?: number;
  offset?: number;
}

function base(server: boolean): string {
  return server ? SERVER_API_URL : API_URL;
}

export function toURLSearchParams(
  raw: Record<string, string | string[] | undefined>,
): URLSearchParams {
  "Next.js передаёт searchParams серверных страниц как plain-объект — приводим его к URLSearchParams."
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(raw)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) value.forEach((item) => params.append(key, item));
    else params.append(key, value);
  }
  return params;
}

export function parseRtnListFilters(params: URLSearchParams): RtnListFilters {
  "Единая точка разбора фильтров каталога из query-строки — используется и на сервере, и на клиенте."
  return {
    search: params.get("search") ?? undefined,
    documentTypes: params.getAll("document_type") as RtnDocumentType[],
    statuses: params.getAll("status") as RtnStatus[],
    oversightAreas: params.getAll("oversight_area"),
    industries: params.getAll("industry"),
    activities: params.getAll("activity"),
    objectTypes: params.getAll("object_type"),
    publishedFrom: params.get("published_from") ?? undefined,
    publishedTo: params.get("published_to") ?? undefined,
  };
}

function buildQuery(filters: RtnListFilters): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  filters.documentTypes?.forEach((value) => params.append("document_type", value));
  filters.statuses?.forEach((value) => params.append("status", value));
  filters.oversightAreas?.forEach((value) => params.append("oversight_area", value));
  filters.industries?.forEach((value) => params.append("industry", value));
  filters.activities?.forEach((value) => params.append("activity", value));
  filters.objectTypes?.forEach((value) => params.append("object_type", value));
  if (filters.publishedFrom) params.set("published_from", filters.publishedFrom);
  if (filters.publishedTo) params.set("published_to", filters.publishedTo);
  if (filters.limit !== undefined) params.set("limit", String(filters.limit));
  if (filters.offset !== undefined) params.set("offset", String(filters.offset));
  return params;
}

export async function fetchRtnTaxonomy(opts: { server?: boolean } = {}): Promise<RtnTaxonomy> {
  const res = await fetch(`${base(Boolean(opts.server))}/public/rtn/taxonomy`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Не удалось загрузить справочник фильтров: ${res.status}`);
  return res.json();
}

export async function fetchRtnList(
  filters: RtnListFilters,
  opts: { server?: boolean } = {},
): Promise<RtnList> {
  const params = buildQuery(filters);
  const res = await fetch(`${base(Boolean(opts.server))}/public/rtn/clarifications?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Не удалось загрузить разъяснения: ${res.status}`);
  return res.json();
}

export async function fetchRtnBySlug(
  slug: string,
  opts: { server?: boolean } = {},
): Promise<RtnDetail | null> {
  const res = await fetch(`${base(Boolean(opts.server))}/public/rtn/clarifications/${encodeURIComponent(slug)}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Не удалось загрузить разъяснение: ${res.status}`);
  return res.json();
}

export async function fetchRelatedRtn(
  slug: string,
  opts: { limit?: number; server?: boolean } = {},
): Promise<RtnListItem[]> {
  const params = new URLSearchParams();
  if (opts.limit !== undefined) params.set("limit", String(opts.limit));
  const qs = params.toString();
  const res = await fetch(
    `${base(Boolean(opts.server))}/public/rtn/clarifications/${encodeURIComponent(slug)}/related${qs ? `?${qs}` : ""}`,
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  return res.json();
}
