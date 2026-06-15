"use client";

import { useRef } from "react";
import Button from "@/source/shared/ui/Button";
import { TextInput } from "@/source/shared/ui/Inputs";
import { FileGallery, RentalPriceField } from "@/source/shared/ui";
import {
  getFileDisplayName,
  getFileGalleryPreviewUrl,
  getFileGalleryThumbUrl,
  isImageFileName,
} from "@/source/shared/lib/filePreview";
import { resolveFileUrl } from "@/source/shared/lib/fileUrl";
import { TypesPicker, type ExpertiseType } from "@/source/entities/expertise";
import type { UserProfile } from "@/source/entities/user";
import { useLicenseTerms } from "../model/useLicenseTerms";
import s from "./LicenseTermsForm.module.scss";

interface Props {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

const LICENSE_FILE_ACCEPT = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";
const LICENSE_FILE_HINT = "PDF / JPG / PNG, до 5 МБ";

const REGULATORY_FILE_ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const REGULATORY_FILE_HINT = "PDF / JPG / PNG / DOC / DOCX, до 10 МБ";

const COMPANY_CARD_ACCEPT = ".pdf,application/pdf";
const COMPANY_CARD_HINT = "Только PDF, до 5 МБ";

export function LicenseTermsForm({ profile, onProfileUpdate }: Props) {
  const {
    form,
    isSaving,
    isUploading,
    isCardUploading,
    isMiningUploading,
    isSroUploading,
    isLabUploading,
    submit,
    replaceFile,
    replaceCompanyCard,
    removeCompanyCardFile,
    replaceMiningLicenseFile,
    replaceSroDesignFile,
    replaceLabAccreditationFile,
  } = useLicenseTerms({ profile, onProfileUpdate });
  const { watch, setValue, formState } = form;
  const errors = formState.errors;
  const shouldValidate = formState.isSubmitted;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardInputRef = useRef<HTMLInputElement>(null);
  const miningInputRef = useRef<HTMLInputElement>(null);
  const sroInputRef = useRef<HTMLInputElement>(null);
  const labInputRef = useRef<HTMLInputElement>(null);

  const fileItems = profile.license_file_url ? [remoteFileItem(profile.license_file_url)] : [];
  const cardItems = profile.company_card_url
    ? [remoteFileItem(profile.company_card_url, "card-remote", "Карточка предприятия", removeCompanyCardFile)]
    : [];
  const miningItems = profile.mining_license_file_url
    ? [remoteFileItem(profile.mining_license_file_url, "mining-remote", "Лицензия маркшейдера")]
    : [];
  const sroItems = profile.sro_design_file_url
    ? [remoteFileItem(profile.sro_design_file_url, "sro-remote", "Выписка из реестра членов СРО в области проектирования")]
    : [];
  const labItems = profile.lab_accreditation_file_url
    ? [remoteFileItem(profile.lab_accreditation_file_url, "lab-remote", "Аккредитация лаборатории")]
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit();
  };

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <header className={s.header}>
        <h2 className={s.title}>Лицензия и условия её предоставления</h2>
        <p className={s.subtitle}>Номер, файл лицензии и стоимость предоставления лицензии для входящих заявок.</p>
      </header>

      <TextInput
        id="licenseNumber"
        value={watch("licenseNumber")}
        autoComplete="off"
        onChange={(e) => setValue("licenseNumber", e.target.value, { shouldValidate })}
        placeholder="Номер лицензии ЭПБ ОПО"
        error={errors.licenseNumber?.message}
      />

      <FileGallery
        label={isUploading ? "Загрузка нового файла…" : "Файл лицензии"}
        hint={LICENSE_FILE_HINT}
        items={fileItems}
        variant="editable"
        onAdd={() => fileInputRef.current?.click()}
        input={
          <input
            ref={fileInputRef}
            type="file"
            accept={LICENSE_FILE_ACCEPT}
            hidden
            onChange={(event) => {
              const next = event.target.files?.[0] ?? null;
              event.target.value = "";
              if (next) replaceFile(next);
            }}
          />
        }
      />

      <TypesPicker
        value={watch("licenseAreas") as ExpertiseType[]}
        onChange={(next) => setValue("licenseAreas", next, { shouldValidate })}
        label="Объекты экспертизы по лицензии"
        error={errors.licenseAreas?.message as string | undefined}
      />

      <FileGallery
        label={isCardUploading ? "Загрузка карточки…" : "Карточка предприятия (необязательно)"}
        hint={COMPANY_CARD_HINT}
        items={cardItems}
        variant="editable"
        onAdd={() => cardInputRef.current?.click()}
        input={
          <input
            ref={cardInputRef}
            type="file"
            accept={COMPANY_CARD_ACCEPT}
            hidden
            onChange={(event) => {
              const next = event.target.files?.[0] ?? null;
              event.target.value = "";
              if (next) replaceCompanyCard(next);
            }}
          />
        }
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

      <div className={s.extrasSection}>
        <h3 className={s.extrasTitle}>Дополнительные разрешительные документы</h3>
        <p className={s.extrasHint}>Заполняйте только если применимо к вашей деятельности.</p>

        <div className={s.extrasItem}>
          <TextInput
            id="miningLicenseNumber"
            value={watch("miningLicenseNumber") ?? ""}
            autoComplete="off"
            onChange={(e) => setValue("miningLicenseNumber", e.target.value, { shouldValidate })}
            placeholder="Лицензия на маркшейдерские работы №"
            error={errors.miningLicenseNumber?.message}
          />
          <FileGallery
            label={isMiningUploading ? "Загрузка файла…" : "Файл лицензии маркшейдера"}
            hint={REGULATORY_FILE_HINT}
            items={miningItems}
            variant="editable"
            onAdd={() => miningInputRef.current?.click()}
            input={
              <input
                ref={miningInputRef}
                type="file"
                accept={REGULATORY_FILE_ACCEPT}
                hidden
                onChange={(event) => {
                  const next = event.target.files?.[0] ?? null;
                  event.target.value = "";
                  if (next) replaceMiningLicenseFile(next);
                }}
              />
            }
          />
        </div>

        <div className={s.extrasItem}>
          <FileGallery
            label={isSroUploading ? "Загрузка файла…" : "Выписка из реестра членов СРО в области проектирования"}
            hint={REGULATORY_FILE_HINT}
            items={sroItems}
            variant="editable"
            onAdd={() => sroInputRef.current?.click()}
            input={
              <input
                ref={sroInputRef}
                type="file"
                accept={REGULATORY_FILE_ACCEPT}
                hidden
                onChange={(event) => {
                  const next = event.target.files?.[0] ?? null;
                  event.target.value = "";
                  if (next) replaceSroDesignFile(next);
                }}
              />
            }
          />
        </div>

        <div className={s.extrasItem}>
          <TextInput
            id="labAccreditationNumber"
            value={watch("labAccreditationNumber") ?? ""}
            autoComplete="off"
            onChange={(e) => setValue("labAccreditationNumber", e.target.value, { shouldValidate })}
            placeholder="Свидетельство об аккредитации лаборатории №"
            error={errors.labAccreditationNumber?.message}
          />
          <FileGallery
            label={isLabUploading ? "Загрузка файла…" : "Файл свидетельства аккредитации"}
            hint={REGULATORY_FILE_HINT}
            items={labItems}
            variant="editable"
            onAdd={() => labInputRef.current?.click()}
            input={
              <input
                ref={labInputRef}
                type="file"
                accept={REGULATORY_FILE_ACCEPT}
                hidden
                onChange={(event) => {
                  const next = event.target.files?.[0] ?? null;
                  event.target.value = "";
                  if (next) replaceLabAccreditationFile(next);
                }}
              />
            }
          />
        </div>
      </div>

      <Button type="submit" variant="chat" size="md" className={s.save} isLoading={isSaving}>
        Сохранить изменения
      </Button>
    </form>
  );
}

function remoteFileItem(
  url: string,
  id: string = "license-remote",
  fallbackName: string = "Лицензия",
  onRemove?: () => void,
) {
  const resolved = resolveFileUrl(url);
  const name = getFileDisplayName(url, fallbackName);
  const isImage = isImageFileName(name);
  return {
    id,
    name,
    url: resolved,
    previewUrl: isImage ? resolved : getFileGalleryPreviewUrl(resolved, name),
    thumbnailUrl: getFileGalleryThumbUrl(resolved, name),
    isImage,
    onRemove,
  };
}
