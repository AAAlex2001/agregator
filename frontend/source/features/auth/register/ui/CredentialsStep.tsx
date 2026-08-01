import type { UseFormReturn } from "react-hook-form";
import Button from "@/source/shared/ui/Button";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import Tabs from "@/source/shared/ui/Tabs";
import { FormSection } from "@/source/shared/ui";
import { ServicesPicker } from "@/source/features/direction-forms";
import type { DirectionCatalogs, DirectionKey, DirectionProfile } from "@/source/entities/direction";
import type { UserRole } from "@/source/entities/user";
import type { RegisterFormValues } from "../model/schema";
import { ExpertProfileFields } from "./credentials/ExpertProfileFields";
import { OrganizationField } from "./credentials/OrganizationField";
import { LicenseDetailsFields } from "./credentials/LicenseDetailsFields";
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
  catalogs: DirectionCatalogs;
  directionDocuments: Partial<Record<DirectionKey, File[]>>;
  licenseFile: File | null;
  miningLicenseFile?: File | null;
  sroDesignFile?: File | null;
  labAccreditationFile?: File | null;
  onPhoneChange: (v: string) => void;
  onRoleSelect: (role: UserRole) => void;
  onServiceToggle: (key: DirectionKey) => void;
  onDirectionChange: (key: DirectionKey, value: DirectionProfile) => void;
  onDirectionDocumentsAdd: (key: DirectionKey, files: File[]) => void;
  onDirectionDocumentRemove: (key: DirectionKey, index: number) => void;
  onLicenseFileSelect: (file: File | null) => void;
  onMiningLicenseFileSelect?: (file: File | null) => void;
  onSroDesignFileSelect?: (file: File | null) => void;
  onLabAccreditationFileSelect?: (file: File | null) => void;
  onSubmit: () => void;
}

export function CredentialsStep({
  form,
  isLoading,
  catalogs,
  directionDocuments,
  licenseFile,
  miningLicenseFile = null,
  sroDesignFile = null,
  labAccreditationFile = null,
  onPhoneChange,
  onRoleSelect,
  onServiceToggle,
  onDirectionChange,
  onDirectionDocumentsAdd,
  onDirectionDocumentRemove,
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

  const directionErrors = form.formState.errors.directions as
    | Record<string, { message?: string }>
    | undefined;

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

        <Tabs
          tabs={ROLE_TABS}
          activeTab={role}
          onTabChange={(id) => onRoleSelect(id as UserRole)}
          variant="squared"
        />

        {!isLicenseHolder && (
          <ServicesPicker
            role={role}
            selected={form.watch("directions")}
            documents={directionDocuments}
            catalogs={catalogs}
            errors={Object.fromEntries(
              Object.entries(directionErrors ?? {}).map(([key, error]) => [key, error?.message]),
            )}
            onToggle={onServiceToggle}
            onChange={onDirectionChange}
            onDocumentsAdd={onDirectionDocumentsAdd}
            onDocumentsRemove={onDirectionDocumentRemove}
          />
        )}

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
