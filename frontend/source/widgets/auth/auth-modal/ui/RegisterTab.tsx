"use client";

import { useRegister, CredentialsStep, EmailConfirmStep } from "@/source/features/auth/register";
import s from "./auth-modal.module.scss";

interface Props {
  onSuccess: () => void;
}

const STEP_LABELS: Record<1 | 2, string> = {
  1: "Шаг 1. Данные",
  2: "Шаг 2. Код",
};

export function RegisterTab({ onSuccess }: Props) {
  const reg = useRegister({ onSuccess });

  return (
    <div className={s.flow}>
      <div className={s.stepHeader}>
        <span className={s.stepIndicator}>{STEP_LABELS[reg.step]}</span>
      </div>

      {reg.step === 1 && (
        <CredentialsStep
          form={reg.form}
          isLoading={reg.isLoading}
          directionFiles={reg.directionFiles}
          licenseFile={reg.licenseFile}
          miningLicenseFile={reg.miningLicenseFile}
          sroDesignFile={reg.sroDesignFile}
          labAccreditationFile={reg.labAccreditationFile}
          onPhoneChange={reg.setPhone}
          onRoleSelect={reg.selectRole}
          onDirectionFilesChange={reg.setDirectionFiles}
          onLicenseFileSelect={reg.selectLicenseFile}
          onMiningLicenseFileSelect={reg.setMiningLicenseFile}
          onSroDesignFileSelect={reg.setSroDesignFile}
          onLabAccreditationFileSelect={reg.setLabAccreditationFile}
          onSubmit={reg.submit}
        />
      )}

      {reg.step === 2 && (
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
