"use client";

import { TypesPicker } from "@/source/entities/expertise";
import type { UserProfile } from "@/source/entities/user";
import Button from "@/source/shared/ui/Button";
import { RentalPriceField } from "@/source/shared/ui";
import { TextInput } from "@/source/shared/ui/Inputs";
import { useLicenseFiles } from "../model/useLicenseFiles";
import { useLicenseTerms } from "../model/useLicenseTerms";
import { LicenseFileField } from "./LicenseFileField";
import s from "./LicenseTermsForm.module.scss";

const LICENSE_ACCEPT = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";
const LICENSE_HINT = "PDF / JPG / PNG, до 5 МБ";
const DOCUMENT_ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const DOCUMENT_HINT = "PDF / JPG / PNG / DOC / DOCX, до 10 МБ";

interface LicenseTermsFormProps {
  profile: UserProfile;
}

/** Лицензия держателя документов: номер, объекты, стоимость предоставления и разрешительные документы. */
export function LicenseTermsForm({ profile }: LicenseTermsFormProps) {
  const { fields, isSaving, change, save } = useLicenseTerms(profile);
  const { uploading, upload, removeCompanyCard } = useLicenseFiles();
  const holder = profile.license_holder;

  return (
    <div className={s.form}>
      <header className={s.header}>
        <h2 className={s.title}>Лицензия и условия её предоставления</h2>
        <p className={s.subtitle}>Номер, файл лицензии и стоимость предоставления лицензии для входящих заявок.</p>
      </header>

      <TextInput
        id="licenseNumber"
        placeholder="Номер лицензии ЭПБ ОПО"
        autoComplete="off"
        value={fields.licenseNumber}
        onChange={(event) => change({ ...fields, licenseNumber: event.target.value })}
      />

      <LicenseFileField
        label="Файл лицензии"
        hint={LICENSE_HINT}
        accept={LICENSE_ACCEPT}
        fileUrl={holder?.license_file_url ?? null}
        isUploading={uploading === "license"}
        onUpload={(file) => upload("license", file)}
      />

      <TypesPicker
        label="Объекты экспертизы по лицензии"
        value={fields.licenseAreas}
        onChange={(licenseAreas) => change({ ...fields, licenseAreas })}
      />

      <LicenseFileField
        label="Карточка предприятия (необязательно)"
        hint="Только PDF, до 5 МБ"
        accept=".pdf,application/pdf"
        fileUrl={holder?.company_card_url ?? null}
        isUploading={uploading === "companyCard"}
        onUpload={(file) => upload("companyCard", file)}
        onRemove={removeCompanyCard}
      />

      <RentalPriceField
        kind={fields.rentalKind}
        percent={fields.rentalPercent}
        fixedAmount={fields.rentalFixedAmount}
        onChangeKind={(rentalKind) => change({ ...fields, rentalKind })}
        onChangePercent={(rentalPercent) => change({ ...fields, rentalPercent })}
        onChangeFixed={(rentalFixedAmount) => change({ ...fields, rentalFixedAmount })}
      />

      <div className={s.extras}>
        <h3 className={s.title}>Дополнительные разрешительные документы</h3>
        <p className={s.extrasHint}>Заполняйте только если применимо к вашей деятельности.</p>

        <div className={s.extrasItem}>
          <TextInput
            id="miningLicenseNumber"
            placeholder="Лицензия на маркшейдерские работы №"
            autoComplete="off"
            value={fields.miningLicenseNumber}
            onChange={(event) => change({ ...fields, miningLicenseNumber: event.target.value })}
          />
          <LicenseFileField
            label="Файл лицензии маркшейдера"
            hint={DOCUMENT_HINT}
            accept={DOCUMENT_ACCEPT}
            fileUrl={holder?.mining_license_file_url ?? null}
            isUploading={uploading === "miningLicense"}
            onUpload={(file) => upload("miningLicense", file)}
          />
        </div>

        <div className={s.extrasItem}>
          <LicenseFileField
            label="Выписка из реестра членов СРО в области проектирования"
            hint={DOCUMENT_HINT}
            accept={DOCUMENT_ACCEPT}
            fileUrl={holder?.sro_design_file_url ?? null}
            isUploading={uploading === "sroDesign"}
            onUpload={(file) => upload("sroDesign", file)}
          />
        </div>

        <div className={s.extrasItem}>
          <LicenseFileField
            label="Выписка из реестра членов СРО в области инженерных изысканий"
            hint={DOCUMENT_HINT}
            accept={DOCUMENT_ACCEPT}
            fileUrl={holder?.sro_survey_file_url ?? null}
            isUploading={uploading === "sroSurvey"}
            onUpload={(file) => upload("sroSurvey", file)}
          />
        </div>

        <div className={s.extrasItem}>
          <TextInput
            id="labAccreditationNumber"
            placeholder="Свидетельство об аккредитации лаборатории №"
            autoComplete="off"
            value={fields.labAccreditationNumber}
            onChange={(event) => change({ ...fields, labAccreditationNumber: event.target.value })}
          />
          <LicenseFileField
            label="Файл свидетельства аккредитации"
            hint={DOCUMENT_HINT}
            accept={DOCUMENT_ACCEPT}
            fileUrl={holder?.lab_accreditation_file_url ?? null}
            isUploading={uploading === "labAccreditation"}
            onUpload={(file) => upload("labAccreditation", file)}
          />
        </div>
      </div>

      <Button variant="chat" size="md" fullWidth isLoading={isSaving} onClick={save}>
        Сохранить
      </Button>
    </div>
  );
}
