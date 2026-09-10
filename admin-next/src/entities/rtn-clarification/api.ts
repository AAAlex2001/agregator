import { RtnClarificationIn, RtnClarificationListItem, RtnClarificationOut } from "./model";

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const listClarifications = async (params: {
  publicationStatus?: string;
}): Promise<{ items: RtnClarificationListItem[]; total: number }> => {
  const qs = new URLSearchParams();
  if (params.publicationStatus) qs.set("publication_status", params.publicationStatus);

  const response = await fetch(`${base}/api/rtn/clarifications?${qs.toString()}`);
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error("Не удалось загрузить список");

  const data = await response.json();
  return {
    total: data.total,
    items: data.items.map((c: any) => ({
      id: c.id,
      documentType: c.document_type,
      status: c.status,
      publicationStatus: c.publication_status,
      title: c.title,
      slug: c.slug,
      letterNumber: c.letter_number,
      publishedAt: c.published_at,
      updatedAt: c.updated_at,
    })),
  };
};

export const loadClarification = async (id: number): Promise<RtnClarificationIn> => {
  const response = await fetch(`${base}/api/rtn/clarifications/${id}`);
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (!response.ok) throw new Error("Не удалось загрузить разъяснение");

  const c = await response.json();
  return {
    id: c.id,
    documentType: c.document_type,
    status: c.status,
    publicationStatus: c.publication_status,
    slug: c.slug,
    title: c.title,
    excerpt: c.excerpt,
    questionText: c.question_text,
    answerHtml: c.answer_html,
    letterNumber: c.letter_number,
    department: c.department,
    sourceUrl: c.source_url,
    requestFiles: c.request_files?.length
      ? c.request_files
      : c.pdf_url
        ? [{ name: "Обращение в ведомство.pdf", url: c.pdf_url }]
        : [],
    responseFiles: c.response_files?.length
      ? c.response_files
      : c.response_pdf_url
        ? [{ name: "Официальный ответ.pdf", url: c.response_pdf_url }]
        : [],
    referencedRegulations: c.referenced_regulations,
    tags: c.tags,
    oversightAreas: c.oversight_areas,
    industries: c.industries,
    activities: c.activities,
    objectTypes: c.object_types,
    metaTitle: c.meta_title,
    metaDescription: c.meta_description,
    metaKeywords: c.meta_keywords,
    publishedAt: c.published_at,
    viewsCount: c.views_count,
  };
};

export const saveClarification = async (
  id: number | null,
  data: RtnClarificationOut,
  answeredQuestionId: number | null = null,
) => {
  const response = await fetch(id ? `${base}/api/rtn/clarifications/${id}` : `${base}/api/rtn/clarifications`, {
    method: id ? "PUT" : "POST",
    body: JSON.stringify({
      document_type: data.documentType,
      status: data.status,
      publication_status: data.publicationStatus,
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      question_text: data.questionText,
      answer_html: data.answerHtml,
      letter_number: data.letterNumber,
      department: data.department,
      source_url: data.sourceUrl,
      pdf_url: data.requestFiles[0]?.url ?? "",
      response_pdf_url: data.responseFiles[0]?.url ?? "",
      request_files: data.requestFiles,
      response_files: data.responseFiles,
      referenced_regulations: data.referencedRegulations,
      tags: data.tags,
      oversight_areas: data.oversightAreas,
      industries: data.industries,
      activities: data.activities,
      object_types: data.objectTypes,
      meta_title: data.metaTitle,
      meta_description: data.metaDescription,
      meta_keywords: data.metaKeywords,
      published_at: data.publishedAt,
      answered_question_id: answeredQuestionId,
    }),
    headers: { "Content-Type": "application/json" },
  });
  if (response.status === 401) throw new Error("UNAUTHORIZED");
  if (response.status === 409) throw new Error("Такой slug уже занят");
  if (!response.ok) throw new Error("Не удалось сохранить разъяснение");
  return response.json();
};

export const deleteClarification = async (id: number) => {
  const response = await fetch(`${base}/api/rtn/clarifications/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Не удалось удалить разъяснение");
};

export const uploadPdf = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(`${base}/api/rtn/upload-pdf`, { method: "POST", body: form });
  if (!response.ok) throw new Error("Не удалось загрузить PDF");
  const data = await response.json();
  return data.url;
};
