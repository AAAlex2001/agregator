import { useRef } from "react";
import type { UseFormReturn } from "react-hook-form";
import { TextInput } from "@/source/shared/ui/Inputs";
import { FileGallery, RentalPriceField } from "@/source/shared/ui";
import { TypesPicker, type ExpertiseType } from "@/source/entities/expertise";
import { isImageFileName } from "@/source/shared/lib/filePreview";
import { useObjectUrl } from "@/source/shared/lib/useObjectUrl";
import type { RegisterFormValues } from "../../model/schema";
import { RegulatoryDocumentsBlock } from "../RegulatoryDocumentsBlock";
import s from "./LicenseDetailsFields.module.scss";

const LICENSE_FILE_ACCEPT = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";
const LICENSE_FILE_HINT = "PDF / JPG / PNG, до 5 МБ";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
  licenseFile: File | null;
  miningLicenseFile: File | null;
  sroDesignFile: File | null;
  labAccreditationFile: File | null;
  onLicenseFileSelect: (file: File | null) => void;
  onMiningLicenseFileSelect?: (file: File | null) => void;
  onSroDesignFileSelect?: (file: File | null) => void;
  onLabAccreditationFileSelect?: (file: File | null) => void;
}

export function LicenseDetailsFields({
  form,
  licenseFile,
  miningLicenseFile,
  sroDesignFile,
  labAccreditationFile,
  onLicenseFileSelect,
  onMiningLicenseFileSelect,
  onSroDesignFileSelect,
  onLabAccreditationFileSelect,
}: Props) {
  const { watch, setValue, formState } = form;
  const errors = formState.errors;
  const shouldValidate = formState.isSubmitted;
  const licenseFileInputRef = useRef<HTMLInputElement>(null);
  const licenseBlobUrl = useObjectUrl(licenseFile);

  const licenseFileItems =
    licenseFile && licenseBlobUrl
      ? [
          {
            id: "license-local",
            name: licenseFile.name,
            url: licenseBlobUrl,
            previewUrl: licenseBlobUrl,
            thumbnailUrl: licenseBlobUrl,
            isImage: isImageFileName(licenseFile.name),
            onRemove: () => onLicenseFileSelect(null),
          },
        ]
      : [];

  return (
    <>
      <TextInput
        id="licenseNumber"
        value={watch("licenseNumber")}
        autoComplete="off"
        onChange={(e) => setValue("licenseNumber", e.target.value, { shouldValidate })}
        placeholder="Номер лицензии ЭПБ ОПО"
        error={errors.licenseNumber?.message}
      />

      <div>
        <FileGallery
          label="Файл лицензии"
          hint={LICENSE_FILE_HINT}
          items={licenseFileItems}
          variant="editable"
          onAdd={() => licenseFileInputRef.current?.click()}
          input={
            <input
              ref={licenseFileInputRef}
              type="file"
              accept={LICENSE_FILE_ACCEPT}
              hidden
              onChange={(event) => {
                onLicenseFileSelect(event.target.files?.[0] ?? null);
                event.target.value = "";
              }}
            />
          }
        />
        {errors.licenseFileName?.message && (
          <span className={s.fileError}>{errors.licenseFileName.message as string}</span>
        )}
      </div>

      <TypesPicker
        value={watch("licenseAreas") as ExpertiseType[]}
        onChange={(next) => setValue("licenseAreas", next, { shouldValidate })}
        label="Объекты экспертизы по лицензии"
        hint="Выберите все типы, по которым работает ваша лицензия — можно несколько"
        error={errors.licenseAreas?.message as string | undefined}
      />

      <RentalPriceField
        kind={watch("rentalKind")}
        percent={watch("rentalPercent")}
        fixedAmount={watch("rentalFixedAmount")}
        errors={{
          percent: errors.rentalPercent?.message,
          fixedAmount: errors.rentalFixedAmount?.message,
        }}
        onChangeKind={(next) => setValue("rentalKind", next, { shouldValidate })}
        onChangePercent={(value) => setValue("rentalPercent", value, { shouldValidate })}
        onChangeFixed={(value) => setValue("rentalFixedAmount", value, { shouldValidate })}
      />

      <RegulatoryDocumentsBlock
        miningLicenseFile={miningLicenseFile}
        sroDesignFile={sroDesignFile}
        labAccreditationFile={labAccreditationFile}
        miningLicenseNumber={watch("miningLicenseNumber") ?? ""}
        labAccreditationNumber={watch("labAccreditationNumber") ?? ""}
        onMiningNumberChange={(v) => setValue("miningLicenseNumber", v, { shouldValidate })}
        onLabNumberChange={(v) => setValue("labAccreditationNumber", v, { shouldValidate })}
        onMiningFileSelect={onMiningLicenseFileSelect}
        onSroFileSelect={onSroDesignFileSelect}
        onLabFileSelect={onLabAccreditationFileSelect}
      />
    </>
  );
}
