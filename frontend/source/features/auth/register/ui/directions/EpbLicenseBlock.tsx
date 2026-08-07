"use client";

import { useFormState, useWatch, type UseFormReturn } from "react-hook-form";
import type { RegisterFormValues } from "../../model/schema";
import { LicenseDetailsFields } from "../credentials/LicenseDetailsFields";
import { DirectionOption } from "./DirectionOption";

export interface HolderLicenseFiles {
  licenseFile: File | null;
  miningLicenseFile: File | null;
  sroDesignFile: File | null;
  labAccreditationFile: File | null;
  onLicenseFileSelect: (file: File | null) => void;
  onMiningLicenseFileSelect?: (file: File | null) => void;
  onSroDesignFileSelect?: (file: File | null) => void;
  onLabAccreditationFileSelect?: (file: File | null) => void;
}

interface Props {
  form: UseFormReturn<RegisterFormValues>;
  files: HolderLicenseFiles;
}

export function EpbLicenseBlock({ form, files }: Props) {
  const enabled = useWatch({ control: form.control, name: "licenseEnabled" });
  const { errors } = useFormState({ control: form.control, name: "licenseEnabled" });

  return (
    <DirectionOption
      id="EPB_LICENSE"
      title="Лицензия на проведение экспертизы промышленной безопасности"
      description="Области действия лицензии, условия предоставления и файлы разрешительных документов"
      checked={enabled}
      error={errors.licenseEnabled?.message}
      onToggle={() =>
        form.setValue("licenseEnabled", !enabled, { shouldValidate: form.formState.isSubmitted })
      }
    >
      {enabled && (
        <LicenseDetailsFields
          form={form}
          licenseFile={files.licenseFile}
          miningLicenseFile={files.miningLicenseFile}
          sroDesignFile={files.sroDesignFile}
          labAccreditationFile={files.labAccreditationFile}
          onLicenseFileSelect={files.onLicenseFileSelect}
          onMiningLicenseFileSelect={files.onMiningLicenseFileSelect}
          onSroDesignFileSelect={files.onSroDesignFileSelect}
          onLabAccreditationFileSelect={files.onLabAccreditationFileSelect}
        />
      )}
    </DirectionOption>
  );
}
