"use client";

import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import {
  AuditCustomerProfileFields,
  AuditExpertProfileFields,
  emptyAuditCatalogs,
  emptyAuditCustomerProfile,
  emptyAuditExpertProfile,
  fetchAuditCatalogs,
  type AuditCatalogs,
} from "@/source/features/directions/audit";
import {
  CadastralProfileFields,
  emptyCadastralProfile,
} from "@/source/features/directions/cadastral";
import {
  emptyExpertiseProfile,
  ExpertiseProfileFields,
} from "@/source/features/directions/expertise";
import { emptyForensicProfile, ForensicProfileFields } from "@/source/features/directions/forensic";
import {
  emptyLaboratoryProfile,
  LaboratoryProfileFields,
} from "@/source/features/directions/laboratory";
import { emptyResearchProfile, ResearchProfileFields } from "@/source/features/directions/research";
import { LocalFilePicker } from "@/source/features/directions/shared/ui/LocalFilePicker";
import { LocalFilesPicker } from "@/source/features/directions/shared/ui/LocalFilesPicker";
import type { DirectionFilesState } from "../../model/directionFiles";
import type { RegisterFormValues } from "../../model/schema";
import { DirectionOption } from "./DirectionOption";
import s from "./DirectionsPicker.module.scss";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
  files: DirectionFilesState;
  onFilesChange: (files: DirectionFilesState) => void;
}

export function DirectionsPicker({ form, files, onFilesChange }: Props) {
  const role = form.watch("role");
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

  const errors = form.formState.errors;
  const validateOnChange = { shouldValidate: form.formState.isSubmitted };

  if (role === "CUSTOMER") {
    const auditCustomer = form.watch("auditCustomerProfile");
    return (
      <ul className={s.list}>
        <DirectionOption
          id="AUDIT_SUPB"
          title="Аудит СУПБ"
          description="Независимая оценка системы управления промышленной безопасностью"
          checked={auditCustomer !== null}
          error={errors.auditCustomerProfile?.message}
          onToggle={() =>
            form.setValue(
              "auditCustomerProfile",
              auditCustomer === null ? { ...emptyAuditCustomerProfile } : null,
              validateOnChange,
            )
          }
        >
          {auditCustomer !== null && (
            <AuditCustomerProfileFields
              value={auditCustomer}
              onChange={(next) => form.setValue("auditCustomerProfile", next, validateOnChange)}
            />
          )}
        </DirectionOption>
      </ul>
    );
  }

  if (role !== "EXPERT") return null;

  const expertise = form.watch("expertiseProfile");
  const auditExpert = form.watch("auditExpertProfile");
  const cadastral = form.watch("cadastralProfile");
  const forensic = form.watch("forensicProfile");
  const research = form.watch("researchProfile");
  const laboratory = form.watch("laboratoryProfile");

  return (
    <ul className={s.list}>
      <DirectionOption
        id="EXPERTISE"
        title="Экспертиза промышленной безопасности"
        description="Удостоверения: область аттестации, объект экспертизы и категория"
        checked={expertise !== null}
        error={errors.expertiseProfile?.message}
        onToggle={() =>
          form.setValue(
            "expertiseProfile",
            expertise === null ? { ...emptyExpertiseProfile } : null,
            validateOnChange,
          )
        }
      >
        {expertise !== null && (
          <ExpertiseProfileFields
            value={expertise}
            onChange={(next) => form.setValue("expertiseProfile", next, validateOnChange)}
          />
        )}
      </DirectionOption>

      <DirectionOption
        id="AUDIT_SUPB"
        title="Аудит СУПБ"
        description="Аудитор с независимой оценкой квалификации или инспекционный орган типа А"
        checked={auditExpert !== null}
        error={errors.auditExpertProfile?.message}
        onToggle={() =>
          form.setValue(
            "auditExpertProfile",
            auditExpert === null ? { ...emptyAuditExpertProfile } : null,
            validateOnChange,
          )
        }
      >
        {auditExpert !== null && (
          <>
            <AuditExpertProfileFields
              value={auditExpert}
              onChange={(next) => form.setValue("auditExpertProfile", next, validateOnChange)}
              catalogs={catalogs}
            />
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

      <DirectionOption
        id="CADASTRAL"
        title="Кадастровые работы"
        description="Аттестат кадастрового инженера, оборудование и место работы"
        checked={cadastral !== null}
        error={errors.cadastralProfile?.message}
        onToggle={() =>
          form.setValue(
            "cadastralProfile",
            cadastral === null ? { ...emptyCadastralProfile } : null,
            validateOnChange,
          )
        }
      >
        {cadastral !== null && (
          <>
            <CadastralProfileFields
              value={cadastral}
              onChange={(next) => form.setValue("cadastralProfile", next, validateOnChange)}
            />
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

      <DirectionOption
        id="FORENSIC"
        title="Судебная экспертиза"
        description="Образование, опыт аналогичных экспертиз и кто выдаёт заключение"
        checked={forensic !== null}
        error={errors.forensicProfile?.message}
        onToggle={() =>
          form.setValue(
            "forensicProfile",
            forensic === null ? { ...emptyForensicProfile } : null,
            validateOnChange,
          )
        }
      >
        {forensic !== null && (
          <>
            <ForensicProfileFields
              value={forensic}
              onChange={(next) => form.setValue("forensicProfile", next, validateOnChange)}
            />
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

      <DirectionOption
        id="RESEARCH"
        title="Научно-исследовательские работы"
        description="Учёная степень, звание и направление научной деятельности"
        checked={research !== null}
        error={errors.researchProfile?.message}
        onToggle={() =>
          form.setValue(
            "researchProfile",
            research === null ? { ...emptyResearchProfile } : null,
            validateOnChange,
          )
        }
      >
        {research !== null && (
          <ResearchProfileFields
            value={research}
            onChange={(next) => form.setValue("researchProfile", next, validateOnChange)}
          />
        )}
      </DirectionOption>

      <DirectionOption
        id="LABORATORY"
        title="Лабораторные исследования"
        description="Область аккредитации лаборатории и дополнительные сведения"
        checked={laboratory !== null}
        error={errors.laboratoryProfile?.message}
        onToggle={() =>
          form.setValue(
            "laboratoryProfile",
            laboratory === null ? { ...emptyLaboratoryProfile } : null,
            validateOnChange,
          )
        }
      >
        {laboratory !== null && (
          <LaboratoryProfileFields
            value={laboratory}
            onChange={(next) => form.setValue("laboratoryProfile", next, validateOnChange)}
          />
        )}
      </DirectionOption>
    </ul>
  );
}
