"use client";

import { useFormState, useWatch, type UseFormReturn } from "react-hook-form";
import {
  emptyForensicProfile,
  ForensicProfileFields,
  type ForensicProfile,
} from "@/source/features/directions/forensic";
import { LocalFilePicker } from "@/source/features/directions/shared/ui/LocalFilePicker";
import { LocalFilesPicker } from "@/source/features/directions/shared/ui/LocalFilesPicker";
import type { DirectionFilesState } from "../../model/directionFiles";
import type { RegisterFormValues } from "../../model/schema";
import { DirectionOption } from "./DirectionOption";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
  files: DirectionFilesState;
  onFilesChange: (files: DirectionFilesState) => void;
}

export function ForensicBlock({ form, files, onFilesChange }: Props) {
  const value = useWatch({ control: form.control, name: "forensicProfile" });
  const { errors } = useFormState({ control: form.control, name: "forensicProfile" });

  const change = (next: ForensicProfile | null) =>
    form.setValue("forensicProfile", next, { shouldValidate: form.formState.isSubmitted });

  return (
    <DirectionOption
      id="FORENSIC"
      title="Судебная экспертиза"
      description="Образование, опыт аналогичных экспертиз и кто выдаёт заключение"
      checked={value !== null}
      error={errors.forensicProfile?.message}
      onToggle={() => change(value === null ? { ...emptyForensicProfile } : null)}
    >
      {value !== null && (
        <>
          <ForensicProfileFields value={value} onChange={change} />
          <LocalFilePicker
            label="Диплом об образовании"
            file={files.forensicDiploma}
            onSelect={(file) => onFilesChange({ ...files, forensicDiploma: file })}
          />
          <LocalFilesPicker
            label="Документы о дополнительном образовании"
            files={files.forensicDocuments}
            onAdd={(picked) =>
              onFilesChange({
                ...files,
                forensicDocuments: [...files.forensicDocuments, ...picked],
              })
            }
            onRemove={(index) =>
              onFilesChange({
                ...files,
                forensicDocuments: files.forensicDocuments.filter(
                  (file, position) => position !== index,
                ),
              })
            }
          />
        </>
      )}
    </DirectionOption>
  );
}
