"use client";

import { FileGallery } from "@/source/shared/ui/FileGallery";

export function TechSpecFiles({ title, files }: { title: string; files: string[] }) {
  return <FileGallery files={files} label={title} hideWhenEmpty />;
}
