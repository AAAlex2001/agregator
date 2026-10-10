"use client";

import { useState } from "react";
import { uploadClarificationPdf, type DocumentFile } from "@/entities/clarification";
import { errorMessage } from "@/shared/lib/errors";
import Field from "@/shared/ui/field";
import FileButton from "@/shared/ui/file-button";
import IconButton from "@/shared/ui/icon-button";
import { CloseIcon, PaperclipIcon } from "@/shared/ui/icons";
import { useToast } from "@/shared/ui/toaster";
import styles from "./style.module.scss";

type PdfFilesFieldProps = {
  label: string;
  value: DocumentFile[];
  onChange: (files: DocumentFile[]) => void;
};

/** Список PDF с загрузкой нескольких файлов и удалением по одному. */
const PdfFilesField = ({ label, value, onChange }: PdfFilesFieldProps) => {
  const toast = useToast();
  const [uploading, setUploading] = useState(false);

  const upload = async (files: File[]) => {
    if (files.length === 0) return;

    setUploading(true);

    try {
      const uploaded = await Promise.all(files.map(async (file) => ({ name: file.name, url: await uploadClarificationPdf(file) })));

      onChange([...value, ...uploaded]);
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось загрузить PDF"), "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Field label={label} hint="Можно выбрать несколько файлов" wide>
      <div className={styles.files}>
        {value.length > 0 && (
          <ul className={styles.list}>
            {value.map((file) => (
              <li key={file.url} className={styles.item}>
                <PaperclipIcon className={styles.icon} />
                <a className={styles.name} href={file.url} target="_blank" rel="noopener noreferrer">
                  {file.name}
                </a>
                <IconButton tone="danger" size="sm" ariaLabel="Убрать файл" onClick={() => onChange(value.filter((item) => item.url !== file.url))}>
                  <CloseIcon />
                </IconButton>
              </li>
            ))}
          </ul>
        )}

        <FileButton size="sm" accept=".pdf" multiple loading={uploading} onSelect={upload}>
          {value.length > 0 ? "Добавить PDF" : "Загрузить PDF"}
        </FileButton>
      </div>
    </Field>
  );
};

export default PdfFilesField;
