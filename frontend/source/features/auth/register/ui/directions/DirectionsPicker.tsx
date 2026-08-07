"use client";

import type { UseFormReturn } from "react-hook-form";
import type { DirectionFilesState } from "../../model/directionFiles";
import type { RegisterFormValues } from "../../model/schema";
import { AuditCustomerBlock } from "./AuditCustomerBlock";
import { AuditExpertBlock } from "./AuditExpertBlock";
import { AuditHolderBlock } from "./AuditHolderBlock";
import { EpbLicenseBlock, type HolderLicenseFiles } from "./EpbLicenseBlock";
import { CadastralBlock } from "./CadastralBlock";
import { ExpertiseBlock } from "./ExpertiseBlock";
import { ForensicBlock } from "./ForensicBlock";
import { LaboratoryBlock } from "./LaboratoryBlock";
import { ResearchBlock } from "./ResearchBlock";
import s from "./DirectionsPicker.module.scss";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
  files: DirectionFilesState;
  onFilesChange: (files: DirectionFilesState) => void;
  holderLicense: HolderLicenseFiles;
}

export function DirectionsPicker({ form, files, onFilesChange, holderLicense }: Props) {
  const role = form.watch("role");

  if (role === "CUSTOMER") {
    return (
      <ul className={s.list}>
        <AuditCustomerBlock form={form} />
      </ul>
    );
  }

  if (role === "LICENSE_HOLDER") {
    return (
      <ul className={s.list}>
        <EpbLicenseBlock form={form} files={holderLicense} />
        <AuditHolderBlock form={form} />
      </ul>
    );
  }

  if (role !== "EXPERT") return null;

  return (
    <ul className={s.list}>
      <ExpertiseBlock form={form} />
      <AuditExpertBlock form={form} files={files} onFilesChange={onFilesChange} />
      <CadastralBlock form={form} files={files} onFilesChange={onFilesChange} />
      <ForensicBlock form={form} files={files} onFilesChange={onFilesChange} />
      <ResearchBlock form={form} />
      <LaboratoryBlock form={form} />
    </ul>
  );
}
