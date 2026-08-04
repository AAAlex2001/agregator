"use client";

import { useEffect, useState } from "react";
import { useFormState, useWatch, type UseFormReturn } from "react-hook-form";
import {
  AuditExpertProfileFields,
  emptyAuditCatalogs,
  emptyAuditExpertProfile,
  fetchAuditCatalogs,
  type AuditCatalogs,
  type AuditExpertProfile,
} from "@/source/features/directions/audit";
import { LocalFilesPicker } from "@/source/features/directions/shared/ui/LocalFilesPicker";
import type { DirectionFilesState } from "../../model/directionFiles";
import type { RegisterFormValues } from "../../model/schema";
import { DirectionOption } from "./DirectionOption";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
  files: DirectionFilesState;
  onFilesChange: (files: DirectionFilesState) => void;
}

export function AuditExpertBlock({ form, files, onFilesChange }: Props) {
  const value = useWatch({ control: form.control, name: "auditExpertProfile" });
  const { errors } = useFormState({ control: form.control, name: "auditExpertProfile" });
  const [catalogs, setCatalogs] = useState<AuditCatalogs>(emptyAuditCatalogs);

  useEffect(() => {
    let alive = true;
    fetchAuditCatalogs()
      .then((loaded) => alive && setCatalogs(loaded))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  const change = (next: AuditExpertProfile | null) =>
    form.setValue("auditExpertProfile", next, { shouldValidate: form.formState.isSubmitted });

  return (
    <DirectionOption
      id="AUDIT_SUPB"
      title="Аудит СУПБ"
      description="Аудитор с независимой оценкой квалификации или инспекционный орган типа А"
      checked={value !== null}
      error={errors.auditExpertProfile?.message}
      onToggle={() => change(value === null ? { ...emptyAuditExpertProfile } : null)}
    >
      {value !== null && (
        <>
          <AuditExpertProfileFields value={value} onChange={change} catalogs={catalogs} />
          <LocalFilesPicker
            label="Дипломы, аттестаты, курсы"
            files={files.auditDocuments}
            onAdd={(picked) =>
              onFilesChange({ ...files, auditDocuments: [...files.auditDocuments, ...picked] })
            }
            onRemove={(index) =>
              onFilesChange({
                ...files,
                auditDocuments: files.auditDocuments.filter((file, position) => position !== index),
              })
            }
          />
        </>
      )}
    </DirectionOption>
  );
}
