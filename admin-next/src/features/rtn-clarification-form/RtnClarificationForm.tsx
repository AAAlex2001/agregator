"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Editor } from "@/entities/article";
import {
  ClarificationStatus,
  DocumentType,
  PdfUpload,
  PublicationStatus,
  RegulationLink,
  useRtnClarificationForm,
} from "@/entities/rtn-clarification";
import { getQuestion } from "@/entities/rtn-question";
import { RtnTaxonomy, TaxonomyOption, loadTaxonomy } from "@/entities/rtn-taxonomy";
import { listTags } from "@/entities/tag";

const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  OFFICIAL_CLARIFICATION: "Официальное разъяснение",
  INFO_LETTER: "Информационное письмо",
  RESPONSE_TO_REQUEST: "Ответ на обращение",
};

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Действует",
  EXPIRED: "Утратило силу",
};

const PUBLICATION_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Черновик",
  PUBLISHED: "Опубликовано",
};

function TaxonomyGroup({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: TaxonomyOption[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <fieldset className="taxonomy-group">
      <legend>{title}</legend>
      <div className="checkbox-grid">
        {options.map((option) => (
          <label key={option.value} className="checkbox-item">
            <input type="checkbox" checked={selected.includes(option.value)} onChange={() => onToggle(option.value)} />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

function RegulationsEditor({
  regulations,
  onChange,
}: {
  regulations: RegulationLink[];
  onChange: (regulations: RegulationLink[]) => void;
}) {
  const update = (index: number, patch: Partial<RegulationLink>) =>
    onChange(regulations.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  const remove = (index: number) => onChange(regulations.filter((_, i) => i !== index));
  const add = () => onChange([...regulations, { label: "", url: "" }]);

  return (
    <div className="regulations-editor">
      {regulations.map((item, index) => (
        <div className="regulation-row" key={index}>
          <input
            placeholder="Название документа (ФНП, ГОСТ, ФЗ…)"
            value={item.label}
            onChange={(e) => update(index, { label: e.target.value })}
          />
          <input placeholder="Ссылка" value={item.url} onChange={(e) => update(index, { url: e.target.value })} />
          <button type="button" className="link danger" onClick={() => remove(index)}>
            Удалить
          </button>
        </div>
      ))}
      <button type="button" onClick={add}>
        + Добавить нормативную ссылку
      </button>
    </div>
  );
}

export function RtnClarificationForm({
  id,
  fromQuestionId = null,
}: {
  id: number | null;
  fromQuestionId?: number | null;
}) {
  const { state, setField, toggleTaxonomy, toggleTag, setRegulations, submit } = useRtnClarificationForm(
    id,
    fromQuestionId,
  );
  const [taxonomy, setTaxonomy] = useState<RtnTaxonomy | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    loadTaxonomy()
      .then(setTaxonomy)
      .catch(() => {});
    listTags()
      .then((tags) => setAllTags(tags.map((t) => t.name)))
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Переносим текст вопроса из очереди «Не нашли ответ?» в черновик нового разъяснения.
    if (fromQuestionId === null) return;
    getQuestion(fromQuestionId)
      .then((question) => setField("questionText", question.questionText))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromQuestionId]);

  if (!state.isLoaded || !taxonomy) return <div className="center muted">Загрузка…</div>;

  const f = state.fields;
  const tagOptions = Array.from(new Set([...allTags, ...f.tags]));

  return (
    <div className="page">
      <header className="topbar">
        <h1>{id ? "Редактирование разъяснения" : "Новое разъяснение"}</h1>
        <Link className="ghost" href="/rtn">
          ← К списку
        </Link>
      </header>

      {state.errorMessage && <div className="error">{state.errorMessage}</div>}

      <div className="form">
        <div className="row">
          <label>
            Тип документа
            <select
              value={f.documentType}
              onChange={(e) => setField("documentType", e.target.value as DocumentType)}
            >
              {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Актуальность
            <select
              value={f.status}
              onChange={(e) => setField("status", e.target.value as ClarificationStatus)}
            >
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Публикация
            <select
              value={f.publicationStatus}
              onChange={(e) => setField("publicationStatus", e.target.value as PublicationStatus)}
            >
              {Object.entries(PUBLICATION_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Заголовок
          <input value={f.title} onChange={(e) => setField("title", e.target.value)} />
          {state.errors.title && <span className="field-error">{state.errors.title}</span>}
        </label>
        <label>
          Slug (URL)
          <input
            value={f.slug}
            onChange={(e) => setField("slug", e.target.value)}
            placeholder="rostehnadzor-otvechaet-primer"
          />
          {state.errors.slug && <span className="field-error">{state.errors.slug}</span>}
        </label>
        <label>
          Краткое описание (для карточки в списке)
          <textarea rows={2} value={f.excerpt} onChange={(e) => setField("excerpt", e.target.value)} />
        </label>

        <div className="row">
          <label>
            Номер письма
            <input
              value={f.letterNumber}
              onChange={(e) => setField("letterNumber", e.target.value)}
              placeholder="№ 12-34/567"
            />
          </label>
          <label>
            Подразделение Ростехнадзора
            <input value={f.department} onChange={(e) => setField("department", e.target.value)} />
          </label>
        </div>
        <label>
          Ссылка на источник (сайт Ростехнадзора)
          <input value={f.sourceUrl} onChange={(e) => setField("sourceUrl", e.target.value)} />
        </label>
        <label>
          Файлы запроса (PDF, можно несколько)
          <PdfUpload value={f.requestFiles} onChange={(files) => setField("requestFiles", files)} />
        </label>
        <label>
          Файлы ответов (PDF, можно несколько)
          <PdfUpload
            value={f.responseFiles}
            onChange={(files) => setField("responseFiles", files)}
          />
        </label>

        <label>
          Текст вопроса
          <textarea rows={3} value={f.questionText} onChange={(e) => setField("questionText", e.target.value)} />
        </label>
        <label>Текст официального ответа</label>
        <Editor value={f.answerHtml} onChange={(html) => setField("answerHtml", html)} />

        <label>Нормативные ссылки, упомянутые в ответе</label>
        <RegulationsEditor regulations={f.referencedRegulations} onChange={setRegulations} />

        <label>Теги</label>
        {tagOptions.length === 0 ? (
          <span className="muted">Тегов пока нет — добавьте их на странице статей.</span>
        ) : (
          <div className="tag-pick">
            {tagOptions.map((name) => (
              <button
                type="button"
                key={name}
                className={f.tags.includes(name) ? "tag-chip on" : "tag-chip"}
                onClick={() => toggleTag(name)}
              >
                {name}
              </button>
            ))}
          </div>
        )}

        <TaxonomyGroup
          title="Область надзора"
          options={taxonomy.oversightAreas}
          selected={f.oversightAreas}
          onToggle={(value) => toggleTaxonomy("oversightAreas", value)}
        />
        <TaxonomyGroup
          title="Отрасль"
          options={taxonomy.industries}
          selected={f.industries}
          onToggle={(value) => toggleTaxonomy("industries", value)}
        />
        <TaxonomyGroup
          title="Вид деятельности"
          options={taxonomy.activities}
          selected={f.activities}
          onToggle={(value) => toggleTaxonomy("activities", value)}
        />
        <TaxonomyGroup
          title="Тип объекта"
          options={taxonomy.objectTypes}
          selected={f.objectTypes}
          onToggle={(value) => toggleTaxonomy("objectTypes", value)}
        />

        <fieldset className="seo">
          <legend>SEO</legend>
          <label>
            meta title
            <input value={f.metaTitle} onChange={(e) => setField("metaTitle", e.target.value)} />
          </label>
          <label>
            meta description
            <textarea
              rows={2}
              value={f.metaDescription}
              onChange={(e) => setField("metaDescription", e.target.value)}
            />
          </label>
          <label>
            meta keywords
            <input value={f.metaKeywords} onChange={(e) => setField("metaKeywords", e.target.value)} />
          </label>
        </fieldset>

        <div className="actions">
          <button className="primary" disabled={state.isSaving} onClick={submit}>
            {state.isSaving ? "Сохраняем…" : "Сохранить"}
          </button>
          <Link className="btn" href="/rtn">
            Отмена
          </Link>
        </div>
      </div>
    </div>
  );
}
