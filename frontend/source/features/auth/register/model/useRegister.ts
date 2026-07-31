"use client";

import { useReducer, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { useSession } from "@/source/features/session";
import { formatRussianPhone } from "@/source/shared/lib/phone";
import {
  confirmRegistrationEmail,
  registerLicenseHolder,
  registerUser,
} from "@/source/entities/user";
import {
  emptyRegisterFormValues,
  registerConfirmSchema,
  registerFormSchema,
  type RegisterConfirmValues,
  type RegisterFormValues,
} from "./schema";
import { toLicenseHolderPayload, toRegisterPayload } from "./mappers";
import {
  initialRegisterWizardState,
  registerWizardReducer,
} from "./reducer";
import {
  ROLE_ID_CUSTOMER,
  ROLE_ID_EXPERT,
  ROLE_ID_LICENSE_HOLDER,
  type UserRole,
} from "./types";

const ROLE_BY_ID: Record<number, UserRole> = {
  [ROLE_ID_CUSTOMER]: "CUSTOMER",
  [ROLE_ID_EXPERT]: "EXPERT",
  [ROLE_ID_LICENSE_HOLDER]: "LICENSE_HOLDER",
};

interface UseRegisterOptions {
  /** Если задан — вызывается после успешного подтверждения почты (напр. чтобы закрыть модалку). Редирект выполняется как обычно. */
  onSuccess?: () => void;
}

export function useRegister(options?: UseRegisterOptions) {
  const router = useRouter();
  const { showError, showSuccess } = useNotifications();
  const { reload } = useSession();
  const [wizard, dispatch] = useReducer(registerWizardReducer, initialRegisterWizardState);
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [miningLicenseFile, setMiningLicenseFile] = useState<File | null>(null);
  const [sroDesignFile, setSroDesignFile] = useState<File | null>(null);
  const [labAccreditationFile, setLabAccreditationFile] = useState<File | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: emptyRegisterFormValues,
    mode: "onBlur",
  });

  const confirmForm = useForm<RegisterConfirmValues>({
    resolver: zodResolver(registerConfirmSchema),
    defaultValues: { code: "" },
    mode: "onBlur",
  });

  const selectRole = (id: number) => {
    const role = ROLE_BY_ID[id];
    if (role) form.setValue("role", role);
    dispatch({ type: "SELECT_ROLE", payload: id });
  };

  const toggleCard = (id: number) => dispatch({ type: "TOGGLE_CARD", payload: id });
  const backToRoles = () => dispatch({ type: "BACK_TO_ROLES" });

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
          await registerUser(toRegisterPayload(values));
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
    selectedRole: wizard.selectedRole,
    openedCardId: wizard.openedCardId,
    pendingEmail: wizard.pendingEmail,
    form,
    confirmForm,
    licenseFile,
    miningLicenseFile,
    sroDesignFile,
    labAccreditationFile,
    isLoading: form.formState.isSubmitting,
    isConfirmLoading: confirmForm.formState.isSubmitting,
    selectRole,
    toggleCard,
    backToRoles,
    submit,
    confirmSubmit,
    setPhone,
    selectLicenseFile,
    setMiningLicenseFile,
    setSroDesignFile,
    setLabAccreditationFile,
  };
}
