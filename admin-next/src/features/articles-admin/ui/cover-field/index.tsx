"use client";

import Image from "next/image";
import { useState } from "react";
import { uploadArticleImage } from "@/entities/article";
import { errorMessage } from "@/shared/lib/errors";
import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import FileButton from "@/shared/ui/file-button";
import { useToast } from "@/shared/ui/toaster";
import styles from "./style.module.scss";

type CoverFieldProps = {
  label: string;
  hint?: string;
  value: string;
  onChange: (url: string) => void;
};

/** Поле с картинкой: превью, загрузка нового файла и кнопка «Убрать». */
const CoverField = ({ label, hint, value, onChange }: CoverFieldProps) => {
  const toast = useToast();
  const [uploading, setUploading] = useState(false);

  const upload = async ([file]: File[]) => {
    if (!file) return;

    setUploading(true);

    try {
      onChange(await uploadArticleImage(file));
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось загрузить картинку"), "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Field label={label} hint={hint}>
      <div className={styles.cover}>
        {value ? (
          <Image className={styles.preview} src={value} alt="" width={320} height={180} unoptimized />
        ) : (
          <div className={styles.empty}>Картинка не загружена</div>
        )}

        <div className={styles.actions}>
          <FileButton size="sm" accept=".jpg,.jpeg,.png,.webp" loading={uploading} onSelect={upload}>
            {value ? "Заменить" : "Загрузить"}
          </FileButton>
          {value && (
            <Button variant="ghost" size="sm" onClick={() => onChange("")}>
              Убрать
            </Button>
          )}
        </div>
      </div>
    </Field>
  );
};

export default CoverField;
