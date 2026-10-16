"use client";

import {
  SURVEY_DOCUMENT_GROUPS,
  useSurveyProfile,
} from "@/entities/survey";
import { DocumentGroup } from "../document-group";

/** Собирает документы образования, НОК, НРС, курсов и аттестации РТН. */
export function SurveyDocuments() {
  const { profile } = useSurveyProfile();

  return (
    <>
      {SURVEY_DOCUMENT_GROUPS.map((item) => (
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
