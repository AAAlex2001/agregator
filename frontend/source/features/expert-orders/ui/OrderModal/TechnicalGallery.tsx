"use client";

import { FileGallery } from "@/source/shared/ui/FileGallery";
import s from "./TechnicalGallery.module.scss";

interface Props {
  files: string[];
  label?: string;
}

export function TechnicalGallery({ files, label = "Файлы технического задания" }: Props) {
  return (
    <div className={s.section}>
      <FileGallery files={files} label={label} emptyText="Файлы отсутствуют" />
    </div>
  );
}