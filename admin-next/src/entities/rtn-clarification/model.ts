export type DocumentType = "OFFICIAL_CLARIFICATION" | "INFO_LETTER" | "RESPONSE_TO_REQUEST";
export type ClarificationStatus = "ACTIVE" | "EXPIRED";
export type PublicationStatus = "DRAFT" | "PUBLISHED";

export type RegulationLink = { label: string; url: string };

// что приходит при загрузке разъяснения
export type RtnClarificationIn = {
  id: number;
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
  pdfUrl: string;
  responsePdfUrl: string;
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
  viewsCount: number;
};

// что уходит при сохранении
export type RtnClarificationOut = Omit<RtnClarificationIn, "id" | "viewsCount">;

export type RtnClarificationListItem = {
  id: number;
  documentType: DocumentType;
  status: ClarificationStatus;
  publicationStatus: PublicationStatus;
  title: string;
  slug: string;
  letterNumber: string;
  publishedAt: string | null;
  updatedAt: string;
};

export const EMPTY_CLARIFICATION: RtnClarificationOut = {
  documentType: "OFFICIAL_CLARIFICATION",
  status: "ACTIVE",
  publicationStatus: "DRAFT",
  slug: "",
  title: "",
  excerpt: "",
  questionText: "",
  answerHtml: "",
  letterNumber: "",
  department: "",
  sourceUrl: "",
  pdfUrl: "",
  responsePdfUrl: "",
  referencedRegulations: [],
  tags: [],
  oversightAreas: [],
  industries: [],
  activities: [],
  objectTypes: [],
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  publishedAt: null,
};

export const toOut = (c: RtnClarificationIn): RtnClarificationOut => ({
  documentType: c.documentType,
  status: c.status,
  publicationStatus: c.publicationStatus,
  slug: c.slug,
  title: c.title,
  excerpt: c.excerpt,
  questionText: c.questionText,
  answerHtml: c.answerHtml,
  letterNumber: c.letterNumber,
  department: c.department,
  sourceUrl: c.sourceUrl,
  pdfUrl: c.pdfUrl,
  responsePdfUrl: c.responsePdfUrl,
  referencedRegulations: c.referencedRegulations,
  tags: c.tags,
  oversightAreas: c.oversightAreas,
  industries: c.industries,
  activities: c.activities,
  objectTypes: c.objectTypes,
  metaTitle: c.metaTitle,
  metaDescription: c.metaDescription,
  metaKeywords: c.metaKeywords,
  publishedAt: c.publishedAt,
});
