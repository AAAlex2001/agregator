"use client";

import { FileGallery } from "@/source/shared/ui/FileGallery";
import s from "./TechSpecFiles.module.scss";

interface Props {
  title: string;
  files: string[];
  /** Если передано и отличается от files — выводим пометку «Файлы изменены» 123. */
  previousFiles?: string[] | null;
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

export function TechSpecFiles({ title, files, previousFiles }: Props) {
  const changed = previousFiles != null && !arraysEqual(previousFiles, files);
  const labelText = changed ? `${title.replace(/[:\s]+$/, "")} · ИЗМЕНЕНЫ:` : title;
  return (
    <div className={changed ? s.wrapChanged : undefined}>
      <FileGallery files={files} label={labelText} hideWhenEmpty />
    </div>
  );
}
