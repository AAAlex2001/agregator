"use client";

import { useFormState, useWatch, type UseFormReturn } from "react-hook-form";
import {
  CadastralProfileFields,
  emptyCadastralProfile,
  type CadastralProfile,
} from "@/source/features/directions/cadastral";
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

export function CadastralBlock({ form, files, onFilesChange }: Props) {
  const value = useWatch({ control: form.control, name: "cadastralProfile" });
  const { errors } = useFormState({ control: form.control, name: "cadastralProfile" });

  const change = (next: CadastralProfile | null) =>
    form.setValue("cadastralProfile", next, { shouldValidate: form.formState.isSubmitted });

  return (
    <DirectionOption
      id="CADASTRAL"
      title="Кадастровые работы"
      description="Аттестат кадастрового инженера, оборудование и место работы"
      checked={value !== null}
      error={errors.cadastralProfile?.message}
      onToggle={() => change(value === null ? { ...emptyCadastralProfile } : null)}
    >
      {value !== null && (
        <>
          <CadastralProfileFields value={value} onChange={change} />
          <LocalFilePicker
            label="Диплом об образовании"
            file={files.cadastralDiploma}
            onSelect={(file) => onFilesChange({ ...files, cadastralDiploma: file })}
          />
          <LocalFilePicker
            label="Квалификационный аттестат"
            file={files.cadastralCertificate}
            onSelect={(file) => onFilesChange({ ...files, cadastralCertificate: file })}
          />
          <LocalFilesPicker
            label="Дипломы, аттестаты, курсы"
            files={files.cadastralDocuments}
            onAdd={(picked) =>
              onFilesChange({
                ...files,
                cadastralDocuments: [...files.cadastralDocuments, ...picked],
              })
            }
            onRemove={(index) =>
              onFilesChange({
                ...files,
                cadastralDocuments: files.cadastralDocuments.filter(
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
