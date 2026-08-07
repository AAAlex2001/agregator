import type { UseFormReturn } from "react-hook-form";
import Button from "@/source/shared/ui/Button";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import Tabs from "@/source/shared/ui/Tabs";
import { FormSection } from "@/source/shared/ui";
import type { UserRole } from "@/source/entities/user";
import type { DirectionFilesState } from "../model/directionFiles";
import type { RegisterFormValues } from "../model/schema";
import { DirectionsPicker } from "./directions/DirectionsPicker";
import { ExpertProfileFields } from "./credentials/ExpertProfileFields";
import { NameFields } from "./credentials/NameFields";
import { OrganizationField } from "./credentials/OrganizationField";
import { ContactFields } from "./credentials/ContactFields";
import { ExpertContactOffer } from "./credentials/ExpertContactOffer";
import { PasswordFields } from "./credentials/PasswordFields";
import { AgreementsFields } from "./credentials/AgreementsFields";
import s from "./CredentialsStep.module.scss";

const ROLE_TABS = [
  { id: "CUSTOMER", label: "Заказчик" },
  { id: "EXPERT", label: "Исполнитель" },
  { id: "LICENSE_HOLDER", label: "Держатель разрешительных документов" },
];

interface Props {
  form: UseFormReturn<RegisterFormValues>;
  isLoading: boolean;
  lockRole?: boolean;
  directionFiles: DirectionFilesState;
  licenseFile: File | null;
  miningLicenseFile?: File | null;
  sroDesignFile?: File | null;
  labAccreditationFile?: File | null;
  onPhoneChange: (v: string) => void;
  onRoleSelect: (role: UserRole) => void;
  onDirectionFilesChange: (files: DirectionFilesState) => void;
  onLicenseFileSelect: (file: File | null) => void;
  onMiningLicenseFileSelect?: (file: File | null) => void;
  onSroDesignFileSelect?: (file: File | null) => void;
  onLabAccreditationFileSelect?: (file: File | null) => void;
  onSubmit: () => void;
}

export function CredentialsStep({
  form,
  isLoading,
  lockRole = false,
  directionFiles,
  licenseFile,
  miningLicenseFile = null,
  sroDesignFile = null,
  labAccreditationFile = null,
  onPhoneChange,
  onRoleSelect,
  onDirectionFilesChange,
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

        {!lockRole && (
          <Tabs
            tabs={ROLE_TABS}
            activeTab={role}
            onTabChange={(id) => onRoleSelect(id as UserRole)}
            variant="squared"
          />
        )}

        <DirectionsPicker
          form={form}
          files={directionFiles}
          onFilesChange={onDirectionFilesChange}
          holderLicense={{
            licenseFile,
            miningLicenseFile,
            sroDesignFile,
            labAccreditationFile,
            onLicenseFileSelect,
            onMiningLicenseFileSelect,
            onSroDesignFileSelect,
            onLabAccreditationFileSelect,
          }}
        />

        {isExpert && <ExpertProfileFields form={form} />}

        {isCustomer && <NameFields form={form} />}

        {(isCustomer || isLicenseHolder) && <OrganizationField form={form} />}

        <ContactFields form={form} onPhoneChange={onPhoneChange} showPhoneHint={!isLicenseHolder} />

        {isExpert && (
          <FormSection
            title="Платный доступ к контактам"
            hint="Телефон и email будут скрыты до подтверждения оплаты по установленной вами цене"
            collapsible
          >
            <ExpertContactOffer form={form} />
          </FormSection>
        )}

        <PasswordFields form={form} />

        <AgreementsFields form={form} />

        <Button type="submit" variant="chat" size="lg" fullWidth isLoading={isLoading}>
          Зарегистрироваться
        </Button>
      </form>
    </div>
  );
}
