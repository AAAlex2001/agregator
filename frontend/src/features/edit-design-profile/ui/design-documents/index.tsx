"use client";

import {
  DESIGN_DOCUMENT_GROUPS,
  useDesignProfile,
} from "@/entities/design";
import { DocumentGroup } from "../document-group";

/** Собирает пять групп подтверждающих документов проектировщика. */
export function DesignDocuments() {
  const { profile } = useDesignProfile();

  return (
    <>
      {DESIGN_DOCUMENT_GROUPS.map((item) => (
        <DocumentGroup
          key={item.group}
          group={item.group}
          label={item.label}
          documents={profile[item.field]}
        />
      ))}
    </>
  );
}
