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
import { TypesPicker } from "@/source/entities/expertise";
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
  const form = useLicenseTerms({ profile, onProfileUpdate });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cardInputRef = useRef<HTMLInputElement>(null);
  const miningInputRef = useRef<HTMLInputElement>(null);
  const sroInputRef = useRef<HTMLInputElement>(null);
  const labInputRef = useRef<HTMLInputElement>(null);

  const holder = profile.license_holder;
  const fileItems = holder?.license_file_url ? [remoteFileItem(holder.license_file_url)] : [];
  const cardItems = holder?.company_card_url
    ? [remoteFileItem(holder.company_card_url, "card-remote", "Карточка предприятия", form.removeCompanyCardFile)]
    : [];
  const miningItems = holder?.mining_license_file_url
    ? [remoteFileItem(holder.mining_license_file_url, "mining-remote", "Лицензия маркшейдера")]
    : [];
  const sroItems = holder?.sro_design_file_url
    ? [remoteFileItem(holder.sro_design_file_url, "sro-remote", "Выписка из реестра членов СРО в области проектирования")]
    : [];
  const labItems = holder?.lab_accreditation_file_url
    ? [remoteFileItem(holder.lab_accreditation_file_url, "lab-remote", "Аккредитация лаборатории")]
    : [];

  return (
    <form className={s.form} onSubmit={form.submit}>
      <header className={s.header}>
        <h2 className={s.title}>Лицензия и условия её предоставления</h2>
        <p className={s.subtitle}>Номер, файл лицензии и стоимость предоставления лицензии для входящих заявок.</p>
      </header>

      <TextInput
        id="licenseNumber"
        value={form.licenseNumber}
        required
        autoComplete="off"
        onChange={(e) => form.setLicenseNumber(e.target.value)}
        placeholder="Номер лицензии ЭПБ ОПО"
      />

      <FileGallery
        label={form.isUploading ? "Загрузка нового файла…" : "Файл лицензии"}
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
              if (next) form.replaceFile(next);
            }}
          />
        }
      />

      <TypesPicker
        value={form.licenseAreas}
        onChange={form.setLicenseAreas}
        label="Объекты экспертизы по лицензии"
      />

      <FileGallery
        label={form.isCardUploading ? "Загрузка карточки…" : "Карточка предприятия (необязательно)"}
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
              if (next) form.replaceCompanyCard(next);
            }}
          />
        }
      />

      <RentalPriceField
        kind={form.rentalKind}
        percent={form.rentalPercent}
        fixedAmount={form.rentalFixedAmount}
        onChangeKind={form.setRentalKind}
        onChangePercent={form.setRentalPercent}
        onChangeFixed={form.setRentalFixedAmount}
      />

      <div className={s.extrasSection}>
        <h3 className={s.extrasTitle}>Дополнительные разрешительные документы</h3>
        <p className={s.extrasHint}>Заполняйте только если применимо к вашей деятельности.</p>

        <div className={s.extrasItem}>
          <TextInput
            id="miningLicenseNumber"
            value={form.miningLicenseNumber}
            autoComplete="off"
            onChange={(e) => form.setMiningLicenseNumber(e.target.value)}
            placeholder="Лицензия на маркшейдерские работы №"
          />
          <FileGallery
            label={form.isMiningUploading ? "Загрузка файла…" : "Файл лицензии маркшейдера"}
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
                  if (next) form.replaceMiningLicenseFile(next);
                }}
              />
            }
          />
        </div>

        <div className={s.extrasItem}>
          <FileGallery
            label={form.isSroUploading ? "Загрузка файла…" : "Выписка из реестра членов СРО в области проектирования"}
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
                  if (next) form.replaceSroDesignFile(next);
                }}
              />
            }
          />
        </div>

        <div className={s.extrasItem}>
          <TextInput
            id="labAccreditationNumber"
            value={form.labAccreditationNumber}
            autoComplete="off"
            onChange={(e) => form.setLabAccreditationNumber(e.target.value)}
            placeholder="Свидетельство об аккредитации лаборатории №"
          />
          <FileGallery
            label={form.isLabUploading ? "Загрузка файла…" : "Файл свидетельства аккредитации"}
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
                  if (next) form.replaceLabAccreditationFile(next);
                }}
              />
            }
          />
        </div>
      </div>

      <Button type="submit" variant="chat" size="md" className={s.save} isLoading={form.isSaving}>
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
