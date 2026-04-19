"use client";

import { FileGallery } from "@/source/shared/ui/FileGallery";

interface Props {
  files: string[];
  label?: string;
}

export function TechnicalGallery({ files, label = "Файлы технического задания" }: Props) {
  return <FileGallery files={files} label={label} emptyText="Файлы отсутствуют" />;
}