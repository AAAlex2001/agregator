import Link from "next/link";
import type { UseFormReturn } from "react-hook-form";
import Button from "@/source/shared/ui/Button";
import { TextInput, EmailInput, PhoneInput, PasswordInput } from "@/source/shared/ui/Inputs";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import { Checkbox } from "@/source/shared/ui";
import { PartySuggestInput, type PartySuggestion } from "@/source/features/party-suggest";
import { TypesPicker, type ExpertiseType } from "@/source/entities/expertise";
import { FileGallery, RentalPriceField } from "@/source/shared/ui";
import { YandexAddressPicker } from "@/source/shared/ui/YandexMap";
import { isImageFileName } from "@/source/shared/lib/filePreview";
import { useObjectUrl } from "@/source/shared/lib/useObjectUrl";
import { useRef } from "react";
import type { RegisterFormValues } from "../model/schema";
import { RegulatoryDocumentsBlock } from "./RegulatoryDocumentsBlock";
import { ExpertAttestationBlock } from "./ExpertAttestationBlock";
import s from "./CredentialsStep.module.scss";

const LICENSE_FILE_ACCEPT = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";
const LICENSE_FILE_HINT = "PDF / JPG / PNG, до 5 МБ";

const REGULATORY_FILE_ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.doc,.docx,application/pdf,image/jpeg,image/png,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const REGULATORY_FILE_HINT = "PDF / JPG / PNG / DOC / DOCX, до 10 МБ";

interface Props {
  form: UseFormReturn<RegisterFormValues>;
  isLoading: boolean;
  licenseFile: File | null;
  miningLicenseFile?: File | null;
  sroDesignFile?: File | null;
  labAccreditationFile?: File | null;
  onPhoneChange: (v: string) => void;
  onLicenseFileSelect: (file: File | null) => void;
  onMiningLicenseFileSelect?: (file: File | null) => void;
  onSroDesignFileSelect?: (file: File | null) => void;
  onLabAccreditationFileSelect?: (file: File | null) => void;
  onSubmit: () => void;
}

const PASSWORD_RULES: Array<{ label: string; test: (pw: string) => boolean }> = [
  { label: "Не менее 6 символов", test: (pw) => pw.length >= 6 },
  { label: "Хотя бы одна заглавная буква (A-Z)", test: (pw) => /[A-Z]/.test(pw) },
  { label: "Хотя бы одна строчная буква (a-z)", test: (pw) => /[a-z]/.test(pw) },
  {
    label: "Только латинские буквы, цифры и спецсимволы",
    test: (pw) => pw.length > 0 && /^[A-Za-z0-9!@#$%^&*()\-_+=\[\]{}|;:'",.<>?/`~ ]+$/.test(pw),
  },
];

export function CredentialsStep({
  form,
  isLoading,
  licenseFile,
  miningLicenseFile = null,
  sroDesignFile = null,
  labAccreditationFile = null,
  onPhoneChange,
  onLicenseFileSelect,
  onMiningLicenseFileSelect,
  onSroDesignFileSelect,
  onLabAccreditationFileSelect,
  onSubmit,
}: Props) {
  const { watch, setValue, formState } = form;
  const errors = formState.errors;
  const role = watch("role");
  const password = watch("password");
  const shouldValidate = formState.isSubmitted;
  const licenseFileInputRef = useRef<HTMLInputElement>(null);
  const licenseBlobUrl = useObjectUrl(licenseFile);

  const isExpert = role === "EXPERT";
  const isCustomer = role === "CUSTOMER";
  const isLicenseHolder = role === "LICENSE_HOLDER";
  const showCompany = isCustomer || isLicenseHolder;

  const locationLat = watch("locationLat");
  const locationLng = watch("locationLng");
  const locationValue =
    locationLat != null && locationLng != null
      ? { lat: locationLat, lng: locationLng, address: watch("locationAddress"), city: watch("locationCity") }
      : null;

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className={s.stepContent}>
      <form onSubmit={handleSubmit} className={s.form} autoComplete="off" data-lpignore="true" data-1p-ignore="true">
        <AutofillGuard idPrefix="register" />

        {isExpert && (
          <>
            <TextInput
              id="lastName"
              value={watch("lastName")}
              autoComplete="off"
              onChange={(e) => setValue("lastName", e.target.value, { shouldValidate })}
              placeholder="Фамилия"
              error={errors.lastName?.message}
            />
            <TextInput
              id="firstName"
              value={watch("firstName")}
              autoComplete="off"
              onChange={(e) => setValue("firstName", e.target.value, { shouldValidate })}
              placeholder="Имя"
              error={errors.firstName?.message}
            />
          </>
        )}

        {isExpert && (
          <div className={`${s.locationBlock} ${s.fullRow}`}>
            <div className={s.locationHead}>
              <span className={s.locationTitle}>Где вы находитесь</span>
              <span className={s.locationHint}>
                Укажите город (и район), где вы базируетесь, — заказчикам будет проще выбрать
                эксперта рядом. Это не ваш личный адрес: достаточно города или района, где вам удобно
                работать. Можно заполнить позже в профиле.
              </span>
            </div>
            <YandexAddressPicker
              value={locationValue}
              onChange={(location) => {
                setValue("locationLat", location.lat);
                setValue("locationLng", location.lng);
                setValue("locationAddress", location.address);
                setValue("locationCity", location.city);
              }}
            />
            <Checkbox
              id="travelsToOtherRegions"
              checked={watch("travelsToOtherRegions")}
              onChange={(checked) => setValue("travelsToOtherRegions", checked)}
            >
              Готов выезжать на объекты в другие регионы
            </Checkbox>
          </div>
        )}

        {isExpert && (
          <div className={s.fullRow}>
            <ExpertAttestationBlock
              confirmed={watch("expertConfirmed")}
              certificates={watch("expertCertificates")}
              showOnMap={watch("showOnMap")}
              mapFields={watch("mapFields")}
              onToggleConfirmed={(v) => setValue("expertConfirmed", v)}
              onChangeCertificates={(v) => setValue("expertCertificates", v)}
              onChangeShowOnMap={(v) => setValue("showOnMap", v)}
              onChangeMapFields={(v) => setValue("mapFields", v)}
            />
          </div>
        )}

        {showCompany && (
          <div className={isLicenseHolder ? s.companyHalf : s.fullRow}>
            <PartySuggestInput
              value={watch("companyName")}
              onChange={(query: string, picked: PartySuggestion | null) => {
                setValue("companyName", picked?.value ?? query, { shouldValidate });
                setValue("companyData", picked, { shouldValidate });
              }}
              placeholder="ИНН или название организации"
              error={errors.companyName?.message as string | undefined}
            />
          </div>
        )}

        {isLicenseHolder && (
          <TextInput
            id="licenseNumber"
            value={watch("licenseNumber")}
            autoComplete="off"
            onChange={(e) => setValue("licenseNumber", e.target.value, { shouldValidate })}
            placeholder="Номер лицензии ЭПБ ОПО"
            error={errors.licenseNumber?.message}
          />
        )}

        {isLicenseHolder && (
          <div className={s.fullRow}>
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
        )}

        {isLicenseHolder && (
          <div className={s.fullRow}>
            <TypesPicker
              value={watch("licenseAreas") as ExpertiseType[]}
              onChange={(next) => setValue("licenseAreas", next, { shouldValidate })}
              label="Объекты экспертизы по лицензии"
              hint="Выберите все типы, по которым работает ваша лицензия — можно несколько"
              error={errors.licenseAreas?.message as string | undefined}
            />
          </div>
        )}

        {isLicenseHolder && (
          <div className={s.fullRow}>
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
          </div>
        )}

        {isLicenseHolder && (
          <div className={s.fullRow}>
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
          </div>
        )}

        <EmailInput
          id="email"
          value={watch("email")}
          autoComplete="off"
          onChange={(e) => setValue("email", e.target.value, { shouldValidate })}
          placeholder="Электронная почта"
          error={errors.email?.message}
        />

        <div className={s.phoneBlock}>
          <PhoneInput
            id="phone"
            value={watch("phone")}
            autoComplete="off"
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="+7-999-999-99-12"
            error={errors.phone?.message}
          />
          {!isLicenseHolder && <p className={s.contactHint}>Номер телефона необязателен</p>}
        </div>

        <PasswordInput
          id="password"
          value={password}
          autoComplete="new-password"
          onChange={(e) => setValue("password", e.target.value, { shouldValidate })}
          placeholder="Пароль"
          error={errors.password?.message}
        />

        <PasswordInput
          id="repeatPassword"
          value={watch("repeatPassword")}
          autoComplete="new-password"
          onChange={(e) => setValue("repeatPassword", e.target.value, { shouldValidate })}
          placeholder="Повторите пароль"
          error={errors.repeatPassword?.message}
        />

        <ul className={`${s.passwordRequirements} ${s.fullRow}`}>
          {PASSWORD_RULES.map((rule) => (
            <li key={rule.label} className={rule.test(password) ? s.requirementMet : ""}>
              {rule.label}
            </li>
          ))}
        </ul>

        <div className={`${s.agreements} ${s.fullRow}`}>
          <Checkbox
            id="agreePrivacy"
            checked={watch("agreePrivacy")}
            onChange={(checked) => setValue("agreePrivacy", checked, { shouldValidate })}
            error={errors.agreePrivacy?.message}
          >
            Я соглашаюсь с{" "}
            <Link href="/privacy-policy" target="_blank" rel="noopener noreferrer" className={s.agreementLink}>
              Политикой конфиденциальности
            </Link>
          </Checkbox>
          <Checkbox
            id="agreeTerms"
            checked={watch("agreeTerms")}
            onChange={(checked) => setValue("agreeTerms", checked, { shouldValidate })}
            error={errors.agreeTerms?.message}
          >
            Я соглашаюсь с{" "}
            <Link href="/user-agreement" target="_blank" rel="noopener noreferrer" className={s.agreementLink}>
              Пользовательским соглашением
            </Link>
          </Checkbox>
        </div>

        <Button type="submit" variant="chat" size="lg" fullWidth isLoading={isLoading} className={s.fullRow}>
          Зарегистрироваться
        </Button>
      </form>
    </div>
  );
}
