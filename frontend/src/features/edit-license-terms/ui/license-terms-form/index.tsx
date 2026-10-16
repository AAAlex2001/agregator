"use client";

import type { ChangeEvent } from "react";
import { TypesPicker } from "@/entities/expertise";
import { RentalPriceField } from "@/entities/license-holder";
import type { UserProfile } from "@/entities/user";
import { Button } from "@/shared/ui/button";
import { TextInput } from "@/shared/ui/text-input";
import { LICENSE_ACCEPT, LICENSE_HINT } from "../../config/documents";
import { useLicenseTermsForm } from "../../model/use-license-terms-form";
import { AdditionalDocuments } from "../additional-documents";
import { LicenseDocumentField } from "../license-document-field";
import styles from "./style.module.scss";

/** Текущий профиль для редактирования условий лицензии. */
interface LicenseTermsFormProps {
  profile: UserProfile;
}

/** Показывает условия предоставления лицензии и загрузку разрешительных документов. */
export function LicenseTermsForm({ profile }: LicenseTermsFormProps) {
  const {
    fields,
    isSaving,
    changeLicenseNumber,
    changeLicenseAreas,
    changeRentalKind,
    changeRentalPercent,
    changeRentalFixedAmount,
    changeMiningLicenseNumber,
    changeLabAccreditationNumber,
    save,
  } = useLicenseTermsForm(profile);
  const holder = profile.license_holder;

  /** Передаёт введённый номер лицензии в поля формы. */
  function changeNumber(event: ChangeEvent<HTMLInputElement>) {
    changeLicenseNumber(event.target.value);
  }

  return (
    <div className={styles.form}>
      <header className={styles.header}>
        <h2 className={styles.title}>Лицензия и условия её предоставления</h2>
        <p className={styles.subtitle}>
          Номер, файл лицензии и стоимость предоставления лицензии для входящих заявок.
        </p>
      </header>
      <TextInput
        id="licenseNumber"
        placeholder="Номер лицензии ЭПБ ОПО"
        autoComplete="off"
        value={fields.licenseNumber}
        onChange={changeNumber}
      />
      <LicenseDocumentField
        kind="license"
        label="Файл лицензии"
        hint={LICENSE_HINT}
        accept={LICENSE_ACCEPT}
        fileUrl={holder?.license_file_url ?? null}
      />
      <TypesPicker
        label="Объекты экспертизы по лицензии"
        value={fields.licenseAreas}
        onChange={changeLicenseAreas}
      />
      <LicenseDocumentField
        kind="companyCard"
        label="Карточка предприятия (необязательно)"
        hint="Только PDF, до 5 МБ"
        accept=".pdf,application/pdf"
        fileUrl={holder?.company_card_url ?? null}
      />
      <RentalPriceField
        kind={fields.rentalKind}
        percent={fields.rentalPercent}
        fixedAmount={fields.rentalFixedAmount}
        onChangeKind={changeRentalKind}
        onChangePercent={changeRentalPercent}
        onChangeFixed={changeRentalFixedAmount}
      />
      <AdditionalDocuments
        holder={holder}
        miningLicenseNumber={fields.miningLicenseNumber}
        labAccreditationNumber={fields.labAccreditationNumber}
        onMiningLicenseNumberChange={changeMiningLicenseNumber}
        onLabAccreditationNumberChange={changeLabAccreditationNumber}
      />
      <Button
        variant="chat"
        size="md"
        fullWidth
        isLoading={isSaving}
        onClick={save}
      >
        Сохранить
      </Button>
    </div>
  );
}
