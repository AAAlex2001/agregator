"use client";

import {
  useRegister,
  RoleSwiper,
  CredentialsStep,
  EmailConfirmStep,
  REGISTER_ROLES,
} from "@/source/features/auth/register";
import Button from "@/source/shared/ui/Button";
import SwiperNavigation from "@/source/shared/ui/SwiperNavigation";
import s from "./auth-modal.module.scss";

interface Props {
  onSuccess: () => void;
}

const STEP_LABELS: Record<1 | 2 | 3, string> = {
  1: "Шаг 1. Выбор роли",
  2: "Шаг 2. Данные",
  3: "Шаг 3. Код",
};

export function RegisterTab({ onSuccess }: Props) {
  const reg = useRegister({ onSuccess });

  return (
    <div className={s.flow}>
      <div className={s.stepHeader}>
        <span className={s.stepIndicator}>{STEP_LABELS[reg.step]}</span>
        {reg.step === 1 && (
          <SwiperNavigation
            className={s.stepNav}
            prevClassName="role-nav--prev"
            nextClassName="role-nav--next"
          />
        )}
        {reg.step === 2 && (
          <Button variant="transparent" size="sm" onClick={reg.backToRoles}>
            Назад
          </Button>
        )}
      </div>

      {reg.step === 1 && <RoleSwiper roles={REGISTER_ROLES} onSelectRole={reg.selectRole} />}

      {reg.step === 2 && (
        <CredentialsStep
          form={reg.form}
          isLoading={reg.isLoading}
          catalogs={reg.catalogs}
          directionDocuments={reg.directionDocuments}
          licenseFile={reg.licenseFile}
          miningLicenseFile={reg.miningLicenseFile}
          sroDesignFile={reg.sroDesignFile}
          labAccreditationFile={reg.labAccreditationFile}
          onPhoneChange={reg.setPhone}
          onDirectionToggle={reg.toggleDirection}
          onDirectionChange={reg.changeDirection}
          onDirectionDocumentsAdd={reg.addDirectionDocuments}
          onDirectionDocumentRemove={reg.removeDirectionDocument}
          onLicenseFileSelect={reg.selectLicenseFile}
          onMiningLicenseFileSelect={reg.setMiningLicenseFile}
          onSroDesignFileSelect={reg.setSroDesignFile}
          onLabAccreditationFileSelect={reg.setLabAccreditationFile}
          onSubmit={reg.submit}
        />
      )}

      {reg.step === 3 && (
        <EmailConfirmStep
          form={reg.confirmForm}
          email={reg.pendingEmail}
          isLoading={reg.isConfirmLoading}
          onSubmit={reg.confirmSubmit}
        />
      )}
    </div>
  );
}
