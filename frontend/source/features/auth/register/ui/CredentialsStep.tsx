import type { UseFormReturn } from "react-hook-form";
import Button from "@/source/shared/ui/Button";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import type { RegisterFormValues } from "../model/schema";
import { ExpertProfileFields } from "./credentials/ExpertProfileFields";
import { OrganizationField } from "./credentials/OrganizationField";
import { LicenseDetailsFields } from "./credentials/LicenseDetailsFields";
import { ContactFields } from "./credentials/ContactFields";
import { ExpertContactOffer } from "./credentials/ExpertContactOffer";
import { PasswordFields } from "./credentials/PasswordFields";
import { AgreementsFields } from "./credentials/AgreementsFields";
import s from "./CredentialsStep.module.scss";

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
  const role = form.watch("role");
  const isExpert = role === "EXPERT";
  const isCustomer = role === "CUSTOMER";
  const isLicenseHolder = role === "LICENSE_HOLDER";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className={s.stepContent}>
      <form
        onSubmit={handleSubmit}
        className={s.form}
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore="true"
      >
        <AutofillGuard idPrefix="register" />

        {isExpert && <ExpertProfileFields form={form} />}

        {(isCustomer || isLicenseHolder) && <OrganizationField form={form} />}

        {isLicenseHolder && (
          <LicenseDetailsFields
            form={form}
            licenseFile={licenseFile}
            miningLicenseFile={miningLicenseFile}
            sroDesignFile={sroDesignFile}
            labAccreditationFile={labAccreditationFile}
            onLicenseFileSelect={onLicenseFileSelect}
            onMiningLicenseFileSelect={onMiningLicenseFileSelect}
            onSroDesignFileSelect={onSroDesignFileSelect}
            onLabAccreditationFileSelect={onLabAccreditationFileSelect}
          />
        )}

        <ContactFields form={form} onPhoneChange={onPhoneChange} showPhoneHint={!isLicenseHolder} />

        {isExpert && <ExpertContactOffer form={form} />}

        <PasswordFields form={form} />

        <AgreementsFields form={form} />

        <Button type="submit" variant="chat" size="lg" fullWidth isLoading={isLoading}>
          Зарегистрироваться
        </Button>
      </form>
    </div>
  );
}
