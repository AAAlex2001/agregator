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

const COMPANY_CARD_ACCEPT = ".pdf,application/pdf";
const COMPANY_CARD_HINT = "Только PDF, до 5 МБ";

export function LicenseTermsForm({ profile, onProfileUpdate }: Props) {
  const {
    form,
    isSaving,
    isUploading,
    isCardUploading,
    submit,
    replaceFile,
    replaceCompanyCard,
    removeCompanyCardFile,
  } = useLicenseTerms({ profile, onProfileUpdate });
  const { watch, setValue, formState } = form;
  const errors = formState.errors;
  const shouldValidate = formState.isSubmitted;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardInputRef = useRef<HTMLInputElement>(null);

  const fileItems = profile.license_file_url ? [remoteFileItem(profile.license_file_url)] : [];
  const cardItems = profile.company_card_url
    ? [remoteFileItem(profile.company_card_url, "card-remote", "Карточка предприятия", removeCompanyCardFile)]
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
        label="Области экспертизы по лицензии"
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
