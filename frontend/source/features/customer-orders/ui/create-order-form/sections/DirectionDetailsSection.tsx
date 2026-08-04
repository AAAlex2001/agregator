"use client";

import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { OrderWorkType } from "@/source/entities/order";
import {
  AuditOrderFields,
  emptyAuditCatalogs,
  fetchAuditCatalogs,
  type AuditCatalogs,
} from "@/source/features/directions/audit";
import { CadastralOrderFields } from "@/source/features/directions/cadastral";
import { ForensicOrderFields } from "@/source/features/directions/forensic";
import { LaboratoryOrderFields } from "@/source/features/directions/laboratory";
import { ResearchOrderFields } from "@/source/features/directions/research";
import type { OrderFormValues } from "../../../model/schema";
import base from "./sectionBase.module.scss";
import s from "./directionDetailsSection.module.scss";

const SECTION_TITLES: Partial<Record<OrderWorkType, string>> = {
  CADASTRAL: "Кадастровые работы",
  FORENSIC: "Судебная экспертиза",
  RESEARCH: "Создать заявку на проведение НИР",
  LABORATORY: "Создать заявку на проведение лабораторных исследований",
  AUDIT_SUPB: "Заявка на аудит СУПБ",
};

interface Props {
  form: UseFormReturn<OrderFormValues>;
}

export function DirectionDetailsSection({ form }: Props) {
  const { watch, setValue, formState } = form;
  const workType = watch("workType");
  const [auditCatalogs, setAuditCatalogs] = useState<AuditCatalogs>(emptyAuditCatalogs);

  useEffect(() => {
    if (workType !== "AUDIT_SUPB") return;
    let alive = true;
    fetchAuditCatalogs()
      .then((loaded) => alive && setAuditCatalogs(loaded))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, [workType]);

  const changeOptions = { shouldDirty: true, shouldValidate: formState.isSubmitted };
  const errorMessage =
    formState.errors.cadastralDetails?.message ??
    formState.errors.forensicDetails?.message ??
    formState.errors.researchDetails?.message ??
    formState.errors.laboratoryDetails?.message ??
    formState.errors.auditDetails?.message;

  return (
    <section className={base.section}>
      <span className={`${base.label} ${s.title}`}>
        {SECTION_TITLES[workType] ?? "Поля направления"}
      </span>

      {workType === "CADASTRAL" && (
        <CadastralOrderFields
          value={watch("cadastralDetails")}
          onChange={(next) => setValue("cadastralDetails", next, changeOptions)}
        />
      )}

      {workType === "FORENSIC" && (
        <ForensicOrderFields
          value={watch("forensicDetails")}
          onChange={(next) => setValue("forensicDetails", next, changeOptions)}
        />
      )}

      {workType === "RESEARCH" && (
        <ResearchOrderFields
          value={watch("researchDetails")}
          onChange={(next) => setValue("researchDetails", next, changeOptions)}
        />
      )}

      {workType === "LABORATORY" && (
        <LaboratoryOrderFields
          value={watch("laboratoryDetails")}
          onChange={(next) => setValue("laboratoryDetails", next, changeOptions)}
        />
      )}

      {workType === "AUDIT_SUPB" && (
        <AuditOrderFields
          value={watch("auditDetails")}
          onChange={(next) => setValue("auditDetails", next, changeOptions)}
          catalogs={auditCatalogs}
        />
      )}

      {typeof errorMessage === "string" && <span className={base.error}>{errorMessage}</span>}
    </section>
  );
}
