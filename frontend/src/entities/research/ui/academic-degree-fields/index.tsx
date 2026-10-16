"use client";

import { useId } from "react";
import { Field } from "@/shared/ui/field";
import { MultiSelect } from "@/shared/ui/multi-select";
import { RadioGroup } from "@/shared/ui/radio-group";
import { toResearchSelectOptions } from "../../model/select-options";
import type { ResearchOption } from "../../model/types";

/** Степень, связанные отрасли науки и отдельные обработчики их выбора. */
interface AcademicDegreeFieldsProps {
  degree: string;
  branches: string[];
  degrees: ResearchOption[];
  scienceBranches: ResearchOption[];
  disabled?: boolean;
  onDegreeChange: (value: string) => void;
  onBranchesChange: (value: string[]) => void;
}

/** Выбор учёной степени и связанных с ней отраслей науки. */
export function AcademicDegreeFields({
  degree,
  branches,
  degrees,
  scienceBranches,
  disabled = false,
  onDegreeChange,
  onBranchesChange,
}: AcademicDegreeFieldsProps) {
  const degreeName = useId();
  const branchesId = useId();
  const degreeOptions = [
    {
      value: "",
      label: "Нет учёной степени",
    },
    ...toResearchSelectOptions(degrees),
  ];

  return (
    <>
      <Field label="Учёная степень">
        <RadioGroup
          name={degreeName}
          value={degree}
          options={degreeOptions}
          disabled={disabled}
          onChange={onDegreeChange}
        />
      </Field>

      {degree && (
        <Field
          label="Отрасли науки"
          htmlFor={branchesId}
        >
          <MultiSelect
            id={branchesId}
            options={toResearchSelectOptions(scienceBranches)}
            value={branches}
            disabled={disabled}
            onChange={onBranchesChange}
          />
        </Field>
      )}
    </>
  );
}
