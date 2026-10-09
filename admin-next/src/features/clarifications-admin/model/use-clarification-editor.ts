"use client";

import { useRouter } from "next/navigation";
import { useEffect, useReducer } from "react";
import { fetchTaxonomy } from "@/entities/clarification";
import { fetchTags } from "@/entities/tag";
import { RTN_PATH, rtnPath } from "@/shared/lib/admin-paths";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import {
  createClarification,
  deleteClarification,
  fetchClarification,
  fetchQuestion,
  updateClarification,
} from "../api/clarifications";
import { editorReducer } from "./reducers";
import type { Clarification, ClarificationFields, ClarificationPayload, TaxonomyDimension } from "./types";

const EMPTY_FIELDS: ClarificationFields = {
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
  requestFiles: [],
  responseFiles: [],
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

/** Поля формы из разъяснения. Старые записи хранили один PDF в pdf_url — он становится первым файлом. */
const toFields = (item: Clarification): ClarificationFields => ({
  documentType: item.document_type,
  status: item.status,
  publicationStatus: item.publication_status,
  slug: item.slug,
  title: item.title,
  excerpt: item.excerpt,
  questionText: item.question_text,
  answerHtml: item.answer_html,
  letterNumber: item.letter_number,
  department: item.department,
  sourceUrl: item.source_url,
  requestFiles: item.request_files.length || !item.pdf_url ? item.request_files : [{ name: "Обращение в ведомство.pdf", url: item.pdf_url }],
  responseFiles:
    item.response_files.length || !item.response_pdf_url
      ? item.response_files
      : [{ name: "Официальный ответ.pdf", url: item.response_pdf_url }],
  referencedRegulations: item.referenced_regulations,
  tags: item.tags,
  oversightAreas: item.oversight_areas,
  industries: item.industries,
  activities: item.activities,
  objectTypes: item.object_types,
  metaTitle: item.meta_title,
  metaDescription: item.meta_description,
  metaKeywords: item.meta_keywords,
  publishedAt: item.published_at,
});

/** Данные для API из полей формы. */
const toPayload = (fields: ClarificationFields, answeredQuestionId: number | null): ClarificationPayload => ({
  document_type: fields.documentType,
  status: fields.status,
  publication_status: fields.publicationStatus,
  slug: fields.slug.trim(),
  title: fields.title.trim(),
  excerpt: fields.excerpt.trim(),
  question_text: fields.questionText.trim(),
  answer_html: fields.answerHtml,
  letter_number: fields.letterNumber.trim(),
  department: fields.department.trim(),
  source_url: fields.sourceUrl.trim(),
  pdf_url: fields.requestFiles[0]?.url ?? "",
  response_pdf_url: fields.responseFiles[0]?.url ?? "",
  request_files: fields.requestFiles,
  response_files: fields.responseFiles,
  referenced_regulations: fields.referencedRegulations.filter((link) => link.label.trim() && link.url.trim()),
  tags: fields.tags,
  oversight_areas: fields.oversightAreas,
  industries: fields.industries,
  activities: fields.activities,
  object_types: fields.objectTypes,
  meta_title: fields.metaTitle.trim(),
  meta_description: fields.metaDescription.trim(),
  meta_keywords: fields.metaKeywords.trim(),
  published_at: fields.publishedAt,
  answered_question_id: answeredQuestionId,
});

const toggle = (values: string[], value: string) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

/** Редактор разъяснения: загрузка, поля, классификатор, сохранение и удаление. */
export const useClarificationEditor = (id: number | null, fromQuestionId: number | null) => {
  const router = useRouter();
  const toast = useToast();
  const [state, dispatch] = useReducer(editorReducer, {
    status: "loading",
    clarification: null,
    fields: EMPTY_FIELDS,
    tags: [],
    taxonomy: null,
    pending: false,
    confirming: false,
  });
  const { fields } = state;

  useEffect(() => {
    let active = true;

    Promise.all([
      id === null ? null : fetchClarification(id),
      fetchTags(),
      fetchTaxonomy(),
      id === null && fromQuestionId !== null ? fetchQuestion(fromQuestionId) : null,
    ])
      .then(([clarification, tags, taxonomy, question]) => {
        if (!active) return;

        if (clarification) dispatch({ type: "fields/change", changes: toFields(clarification) });
        if (question) dispatch({ type: "fields/change", changes: { questionText: question.question_text } });
        dispatch({ type: "load/success", clarification, tags, taxonomy });
      })
      .catch(() => {
        if (active) dispatch({ type: "load/error" });
      });

    return () => {
      active = false;
    };
  }, [id, fromQuestionId]);

  const change = (changes: Partial<ClarificationFields>) => dispatch({ type: "fields/change", changes });

  const toggleTag = (name: string) => change({ tags: toggle(fields.tags, name) });

  const toggleTaxonomy = (dimension: TaxonomyDimension, value: string) =>
    change({ [dimension]: toggle(fields[dimension], value) });

  /** Сохранить разъяснение. Новое создаётся и открывается на редактирование. */
  const save = async () => {
    dispatch({ type: "save/start" });

    try {
      if (state.clarification) {
        const saved = await updateClarification(state.clarification.id, toPayload(fields, null));

        dispatch({ type: "load/success", clarification: saved, tags: state.tags, taxonomy: state.taxonomy! });
        toast("Разъяснение сохранено");
      } else {
        const created = await createClarification(toPayload(fields, fromQuestionId));

        toast("Разъяснение создано");
        router.replace(rtnPath(created.id));
      }
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось сохранить разъяснение"), "error");
    } finally {
      dispatch({ type: "save/finish" });
    }
  };

  const remove = async () => {
    if (!state.clarification) return;

    dispatch({ type: "save/start" });

    try {
      await deleteClarification(state.clarification.id);
      toast("Разъяснение удалено");
      router.replace(RTN_PATH);
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось удалить разъяснение"), "error");
      dispatch({ type: "save/finish" });
    }
  };

  const askRemove = () => dispatch({ type: "remove/ask" });
  const cancelRemove = () => dispatch({ type: "remove/cancel" });

  return { state, change, toggleTag, toggleTaxonomy, save, remove, askRemove, cancelRemove };
};
