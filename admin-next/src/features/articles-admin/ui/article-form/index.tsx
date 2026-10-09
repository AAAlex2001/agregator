"use client";

import { ARTICLE_KIND_LABELS, ARTICLE_STATUS_LABELS, type ArticleKind, type ArticleStatus } from "@/entities/article";
import { ARTICLE_DIRECTIONS, DIRECTION_LABELS } from "@/entities/direction";
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
import { uploadImage, uploadVideo } from "../../api/articles";
import type { ArticleFields } from "../../model/types";
import CoverField from "../cover-field";
import styles from "./style.module.scss";

const KIND_OPTIONS = toOptions(ARTICLE_KIND_LABELS);
const STATUS_OPTIONS = toOptions(ARTICLE_STATUS_LABELS);
const DIRECTION_OPTIONS = [
  { value: "", label: "Общая" },
  ...ARTICLE_DIRECTIONS.map((value) => ({ value, label: DIRECTION_LABELS[value] })),
];

type ArticleFormProps = {
  fields: ArticleFields;
  tags: Tag[];
  pending: boolean;
  isNew: boolean;
  onChange: (changes: Partial<ArticleFields>) => void;
  onToggleTag: (name: string) => void;
  onSubmit: () => void;
};

/** Форма статьи: публикация, тексты, обложки, содержание, теги и SEO. */
const ArticleForm = ({ fields, tags, pending, isNew, onChange, onToggleTag, onSubmit }: ArticleFormProps) => (
  <form
    className={styles.form}
    onSubmit={(event) => {
      event.preventDefault();
      onSubmit();
    }}
  >
    <Panel title="Публикация">
      <FieldGrid>
        <Field label="Тип">
          <Select ariaLabel="Тип" options={KIND_OPTIONS} value={fields.kind} onChange={(kind) => onChange({ kind: kind as ArticleKind })} />
        </Field>

        <Field label="Статус">
          <Select
            ariaLabel="Статус"
            options={STATUS_OPTIONS}
            value={fields.status}
            onChange={(status) => onChange({ status: status as ArticleStatus })}
          />
        </Field>

        <Field label="Направление" hint="Статья попадёт в блок новостей на лендинге направления">
          <Select ariaLabel="Направление" options={DIRECTION_OPTIONS} value={fields.direction} onChange={(direction) => onChange({ direction })} />
        </Field>

        <Field label="Slug (URL)" hint="Латиница и дефисы, менять после публикации нельзя">
          <Input ariaLabel="Slug" placeholder="zagolovok-stati" maxLength={220} value={fields.slug} onChange={(slug) => onChange({ slug })} />
        </Field>

        <Field label="Заголовок" wide>
          <Input ariaLabel="Заголовок" maxLength={300} value={fields.title} onChange={(title) => onChange({ title })} />
        </Field>

        <Field label="Краткое описание" hint="Лид под заголовком и текст карточки в списке" wide>
          <Textarea ariaLabel="Краткое описание" rows={2} value={fields.excerpt} onChange={(excerpt) => onChange({ excerpt })} />
        </Field>
      </FieldGrid>
    </Panel>

    <Panel title="Картинки">
      <FieldGrid>
        <CoverField label="Обложка" hint="PNG, JPG или WebP" value={fields.coverImage} onChange={(coverImage) => onChange({ coverImage })} />
        <CoverField
          label="Превью для Telegram"
          hint="Картинка слева, справа — место под заголовок"
          value={fields.tgCoverImage}
          onChange={(tgCoverImage) => onChange({ tgCoverImage })}
        />
        <CoverField
          label="OG-картинка"
          hint="Для соцсетей; если пусто, берётся обложка"
          value={fields.ogImage}
          onChange={(ogImage) => onChange({ ogImage })}
        />
      </FieldGrid>
    </Panel>

    <Panel title="Содержание">
      <RichEditor
        ariaLabel="Текст статьи"
        value={fields.contentHtml}
        onChange={(contentHtml) => onChange({ contentHtml })}
        onUploadImage={uploadImage}
        onUploadVideo={uploadVideo}
      />
    </Panel>

    <Panel title="Теги">
      <TagPicker options={tags.map((tag) => tag.name)} selected={fields.tags} onToggle={onToggleTag} />
    </Panel>

    <SeoFieldsPanel fields={fields} onChange={onChange} />

    <Button className={styles.submit} type="submit" loading={pending} disabled={!fields.title.trim() || !fields.slug.trim()}>
      {isNew ? "Создать статью" : "Сохранить"}
    </Button>
  </form>
);

export default ArticleForm;
