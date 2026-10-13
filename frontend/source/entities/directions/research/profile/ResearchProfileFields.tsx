"use client";

import { TextArea } from "@/source/shared/ui/Inputs";
import { MultiSelect } from "@/source/shared/ui/MultiSelect";
import { RadioGroup } from "@/source/shared/ui/RadioGroup";
import { Field, FieldStack } from "../../shared";
import type { CatalogOption } from "../../shared/model/catalog";
import type { ResearchCatalogs } from "../catalogs/types";
import type { ResearchProfile } from "./types";

const withNone = (items: CatalogOption[], noneLabel: string) => [
  { value: "", label: noneLabel },
  ...items.map((item) => ({ value: item.code, label: item.title })),
];

interface ResearchProfileFieldsProps {
  value: ResearchProfile;
  onChange: (value: ResearchProfile) => void;
  catalogs: ResearchCatalogs;
}

/** Анкета исследователя: учёная степень с отраслями науки, звание и направление работ. */
export function ResearchProfileFields({ value, onChange, catalogs }: ResearchProfileFieldsProps) {
  return (
    <FieldStack>
      <Field label="Учёная степень">
        <RadioGroup
          name="research-degree"
          value={value.academic_degree}
          options={withNone(catalogs.academic_degrees, "Нет учёной степени")}
          onChange={(next) =>
            onChange({ ...value, academic_degree: next, science_branches: next ? value.science_branches : [] })
          }
        />
      </Field>

      {value.academic_degree && (
        <Field label="Отрасли науки">
          <MultiSelect
            id="research-branches"
            options={catalogs.science_branches}
            value={value.science_branches}
            onChange={(next) => onChange({ ...value, science_branches: next })}
          />
        </Field>
      )}

      <Field label="Учёное звание">
        <RadioGroup
          name="research-title"
          value={value.academic_title}
          options={withNone(catalogs.academic_titles, "Нет учёного звания")}
          onChange={(next) => onChange({ ...value, academic_title: next })}
        />
      </Field>

      <Field label="Направление научной деятельности">
        <TextArea
          value={value.research_field}
          onChange={(event) => onChange({ ...value, research_field: event.target.value })}
          placeholder="Область исследований, ключевые темы работ"
          maxLength={5000}
        />
      </Field>
    </FieldStack>
  );
}
