"use client";

import { useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { useSession } from "@/source/features/session";
import { formatRussianPhone } from "@/source/shared/lib/phone";
import type { AuthPreset } from "@/source/shared/lib/auth-modal";
import { confirmRegistrationEmail, registerLicenseHolder, registerUser } from "./api";
import { emptyDirectionFiles, toRegisterDocuments, type DirectionFilesState } from "./directionFiles";
import {
  emptyRegisterFormValues,
  presetRegisterFormValues,
  registerConfirmSchema,
  registerFormSchema,
  type RegisterConfirmValues,
  type RegisterFormValues,
} from "./schema";
import { toLicenseHolderPayload, toRegisterPayload } from "./mappers";
import { initialRegisterWizardState, registerWizardReducer } from "./reducer";
import type { UserRole } from "./types";

interface UseRegisterOptions {
  /** Если задан — вызывается после успешного подтверждения почты (напр. чтобы закрыть модалку). Редирект выполняется как обычно. */
  onSuccess?: () => void;
  /** Фиксированная роль с лендинга: переключатель ролей скрыт, направление предвыбрано. */
  preset?: AuthPreset | null;
}

export function useRegister(options?: UseRegisterOptions) {
  const router = useRouter();
  const { showError, showSuccess } = useNotifications();
  const { reload } = useSession();
  const [wizard, dispatch] = useReducer(registerWizardReducer, initialRegisterWizardState);
  const [directionFiles, setDirectionFiles] = useState<DirectionFilesState>(emptyDirectionFiles);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [miningLicenseFile, setMiningLicenseFile] = useState<File | null>(null);
  const [sroDesignFile, setSroDesignFile] = useState<File | null>(null);
  const [labAccreditationFile, setLabAccreditationFile] = useState<File | null>(null);

  const preset = options?.preset ?? null;
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: preset ? presetRegisterFormValues(preset) : emptyRegisterFormValues,
    mode: "onBlur",
  });

  const confirmForm = useForm<RegisterConfirmValues>({
    resolver: zodResolver(registerConfirmSchema),
    defaultValues: { code: "" },
    mode: "onBlur",
  });

  const selectRole = (role: UserRole) => {
    form.setValue("role", role);
    form.setValue("licenseEnabled", true);
    form.setValue("expertiseProfile", null);
    form.setValue("auditExpertProfile", null);
    form.setValue("auditCustomerProfile", null);
    form.setValue("auditLicenseHolderProfile", null);
    form.setValue("cadastralProfile", null);
    form.setValue("forensicProfile", null);
    form.setValue("researchProfile", null);
    form.setValue("laboratoryProfile", null);
    setDirectionFiles(emptyDirectionFiles);
  };

  const setPhone = (raw: string) => {
    form.setValue("phone", formatRussianPhone(raw), {
      shouldValidate: form.formState.isSubmitted,
    });
  };

  const selectLicenseFile = (file: File | null) => {
    setLicenseFile(file);
    form.setValue("licenseFileName", file?.name ?? "", {
      shouldValidate: form.formState.isSubmitted,
    });
  };

  const submit = form.handleSubmit(
    async (values) => {
      try {
        if (values.role === "LICENSE_HOLDER") {
          await registerLicenseHolder(
            toLicenseHolderPayload(values),
            licenseFile,
            miningLicenseFile,
            sroDesignFile,
            labAccreditationFile,
          );
        } else {
          await registerUser(toRegisterPayload(values), toRegisterDocuments(directionFiles));
        }
        dispatch({ type: "GO_TO_CONFIRM", payload: values.email.trim() });
      } catch (err) {
        showError(err instanceof Error ? err.message : "Произошла ошибка");
      }
    },
    (errors) => {
      const first = Object.values(errors)[0];
      if (first && "message" in first && typeof first.message === "string") {
        showError(first.message);
      }
    },
  );

  const confirmSubmit = confirmForm.handleSubmit(
    async (values) => {
      try {
        const role = form.getValues("role");
        await confirmRegistrationEmail(wizard.pendingEmail, values.code, role);
        await reload();
        showSuccess("Почта подтверждена");
        options?.onSuccess?.();
        if (role === "CUSTOMER" || role === "EXPERT") {
          router.push("/landing");
        } else {
          router.push("/settings");
        }
      } catch (err) {
        showError(err instanceof Error ? err.message : "Произошла ошибка");
      }
    },
    (errors) => {
      const first = Object.values(errors)[0];
      if (first && "message" in first && typeof first.message === "string") {
        showError(first.message);
      }
    },
  );

  return {
    step: wizard.step,
    pendingEmail: wizard.pendingEmail,
    form,
    confirmForm,
    lockRole: preset !== null,
    directionFiles,
    setDirectionFiles,
    licenseFile,
    miningLicenseFile,
    sroDesignFile,
    labAccreditationFile,
    isLoading: form.formState.isSubmitting,
    isConfirmLoading: confirmForm.formState.isSubmitting,
    selectRole,
    submit,
    confirmSubmit,
    setPhone,
    selectLicenseFile,
    setMiningLicenseFile,
    setSroDesignFile,
    setLabAccreditationFile,
  };
}
