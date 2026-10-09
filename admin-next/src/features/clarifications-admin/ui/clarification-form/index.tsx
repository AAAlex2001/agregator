"use client";

import {
  CLARIFICATION_STATUS_LABELS,
  DOCUMENT_TYPE_LABELS,
  PUBLICATION_STATUS_LABELS,
  type ClarificationStatus,
  type DocumentType,
  type PublicationStatus,
  type Taxonomy,
} from "@/entities/clarification";
import { TagPicker, type Tag } from "@/entities/tag";
import { toOptions } from "@/shared/lib/options";
import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import FieldGrid from "@/shared/ui/field-grid";
import Input from "@/shared/ui/input";
import Panel from "@/shared/ui/panel";
import RichEditor from "@/shared/ui/rich-editor";
import Select from "@/shared/ui/select";
import SeoFieldsPanel from "@/shared/ui/seo-fields";
import Textarea from "@/shared/ui/textarea";
import type { ClarificationFields, TaxonomyDimension } from "../../model/types";
import PdfFilesField from "../pdf-files-field";
import RegulationsField from "../regulations-field";
import TaxonomyFields from "../taxonomy-fields";
import styles from "./style.module.scss";

const DOCUMENT_TYPE_OPTIONS = toOptions(DOCUMENT_TYPE_LABELS);
const STATUS_OPTIONS = toOptions(CLARIFICATION_STATUS_LABELS);
const PUBLICATION_OPTIONS = toOptions(PUBLICATION_STATUS_LABELS);

type ClarificationFormProps = {
  fields: ClarificationFields;
  tags: Tag[];
  taxonomy: Taxonomy;
  pending: boolean;
  isNew: boolean;
  onChange: (changes: Partial<ClarificationFields>) => void;
  onToggleTag: (name: string) => void;
  onToggleTaxonomy: (dimension: TaxonomyDimension, value: string) => void;
  onSubmit: () => void;
};

/** Форма разъяснения: документ, тексты, файлы, нормативные ссылки, теги, классификатор и SEO. */
const ClarificationForm = ({
  fields,
  tags,
  taxonomy,
  pending,
  isNew,
  onChange,
  onToggleTag,
  onToggleTaxonomy,
  onSubmit,
}: ClarificationFormProps) => (
  <form
    className={styles.form}
    onSubmit={(event) => {
      event.preventDefault();
      onSubmit();
    }}
  >
    <Panel title="Документ">
      <FieldGrid>
        <Field label="Тип документа">
          <Select
            ariaLabel="Тип документа"
            options={DOCUMENT_TYPE_OPTIONS}
            value={fields.documentType}
            onChange={(documentType) => onChange({ documentType: documentType as DocumentType })}
          />
        </Field>

        <Field label="Актуальность">
          <Select
            ariaLabel="Актуальность"
            options={STATUS_OPTIONS}
            value={fields.status}
            onChange={(status) => onChange({ status: status as ClarificationStatus })}
          />
        </Field>

        <Field label="Публикация">
          <Select
            ariaLabel="Публикация"
            options={PUBLICATION_OPTIONS}
            value={fields.publicationStatus}
            onChange={(publicationStatus) => onChange({ publicationStatus: publicationStatus as PublicationStatus })}
          />
        </Field>

        <Field label="Slug (URL)" hint="Латиница и дефисы">
          <Input
            ariaLabel="Slug"
            placeholder="rostehnadzor-otvechaet-primer"
            maxLength={220}
            value={fields.slug}
            onChange={(slug) => onChange({ slug })}
          />
        </Field>

        <Field label="Заголовок" wide>
          <Input ariaLabel="Заголовок" maxLength={300} value={fields.title} onChange={(title) => onChange({ title })} />
        </Field>

        <Field label="Краткое описание" hint="Текст карточки в списке" wide>
          <Textarea ariaLabel="Краткое описание" rows={2} value={fields.excerpt} onChange={(excerpt) => onChange({ excerpt })} />
        </Field>

        <Field label="Номер письма">
          <Input ariaLabel="Номер письма" placeholder="№ 12-34/567" maxLength={100} value={fields.letterNumber} onChange={(letterNumber) => onChange({ letterNumber })} />
        </Field>

        <Field label="Подразделение Ростехнадзора">
          <Input ariaLabel="Подразделение" maxLength={300} value={fields.department} onChange={(department) => onChange({ department })} />
        </Field>

        <Field label="Ссылка на источник" hint="Страница на сайте Ростехнадзора, если ответ опубликован" wide>
          <Input type="url" ariaLabel="Ссылка на источник" maxLength={500} value={fields.sourceUrl} onChange={(sourceUrl) => onChange({ sourceUrl })} />
        </Field>
      </FieldGrid>
    </Panel>

    <Panel title="Файлы">
      <FieldGrid>
        <PdfFilesField label="Файлы запроса" value={fields.requestFiles} onChange={(requestFiles) => onChange({ requestFiles })} />
        <PdfFilesField label="Файлы ответов" value={fields.responseFiles} onChange={(responseFiles) => onChange({ responseFiles })} />
      </FieldGrid>
    </Panel>

    <Panel title="Вопрос">
      <Textarea ariaLabel="Текст вопроса" rows={3} value={fields.questionText} onChange={(questionText) => onChange({ questionText })} />
    </Panel>

    <Panel title="Официальный ответ">
      <RichEditor ariaLabel="Текст ответа" value={fields.answerHtml} onChange={(answerHtml) => onChange({ answerHtml })} />
    </Panel>

    <Panel title="Нормативные ссылки, упомянутые в ответе">
      <RegulationsField value={fields.referencedRegulations} onChange={(referencedRegulations) => onChange({ referencedRegulations })} />
    </Panel>

    <Panel title="Теги">
      <TagPicker options={tags.map((tag) => tag.name)} selected={fields.tags} onToggle={onToggleTag} />
    </Panel>

    <TaxonomyFields taxonomy={taxonomy} fields={fields} onToggle={onToggleTaxonomy} />

    <SeoFieldsPanel fields={fields} onChange={onChange} />

    <Button className={styles.submit} type="submit" loading={pending} disabled={!fields.title.trim() || !fields.slug.trim()}>
      {isNew ? "Создать разъяснение" : "Сохранить"}
    </Button>
  </form>
);

export default ClarificationForm;
