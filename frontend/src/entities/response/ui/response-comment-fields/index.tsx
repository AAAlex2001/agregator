"use client";

import type { Dispatch } from "react";
import type { FileGalleryItem } from "@/shared/ui/file-gallery";
import { Field } from "@/shared/ui/field";
import { TextArea } from "@/shared/ui/text-area";
import type { ResponseOfferAction } from "../../model/offer";
import { ResponseFilesField } from "../response-files-field";
import styles from "./style.module.scss";

/** Комментарий, вложения и их изменения. */
interface ResponseCommentFieldsProps {
  comment: string;
  files: FileGalleryItem[];
  dispatch: Dispatch<ResponseOfferAction>;
  onAddFiles: (files: FileList | null) => void;
}

/** Комментарий для заказчика и файлы предложения. */
export function ResponseCommentFields({
  comment,
  files,
  dispatch,
  onAddFiles,
}: ResponseCommentFieldsProps) {
  return (
    <div className={styles.fields}>
      <Field label="Комментарий для заказчика">
        <TextArea
          value={comment}
          rows={5}
          maxLength={5000}
          placeholder="Опыт с похожими объектами, состав работ, что нужно от заказчика"
          onChange={(event) => dispatch({
            type: "field/changed",
            field: "comment",
            value: event.target.value,
          })}
        />
      </Field>
      <ResponseFilesField
        items={files}
        onAdd={onAddFiles}
      />
    </div>
  );
}