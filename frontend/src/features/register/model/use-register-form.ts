"use client";

import { useReducer } from "react";
import { clearReferralCode, readReferralCode } from "@/entities/referral";
import type { UserRole } from "@/entities/user";
import { useLocalFiles } from "@/shared/lib/use-local-files";
import { useNotifications } from "@/shared/ui/notifications";
import type { RegistrationAccount } from "./account";
import type { RegistrationCompany } from "./company";
import type { CustomerRegistration } from "./customer";
import type { ExpertRegistration } from "./expert";
import { getExpertDocuments } from "./expert-documents";
import type { HolderRegistration } from "./holder";
import { createRegisterState, registerReducer } from "./reducer";
import { submitCustomer } from "./submit-customer";
import { submitExpert } from "./submit-expert";
import { submitHolder } from "./submit-holder";
import type { RegisterFormOptions } from "./types";
import { validateRegistration } from "./validate-registration";

/** Хранит форму регистрации и отправляет выбранный ролевой сценарий. */
export function useRegisterForm({
  preset,
  onRegistered,
  onBusyChange,
}: RegisterFormOptions) {
  const [state, dispatch] = useReducer(registerReducer, preset, createRegisterState);
  const files = useLocalFiles();
  const { showError } = useNotifications();

  /** Освобождает документы сбрасываемых направлений перед сменой роли. */
  function changeRole(role: UserRole) {
    if (state.isSubmitting || state.role === role) {
      return;
    }

    for (const document of getExpertDocuments(state.expert)) {
      files.removeFile(document.selected);
    }

    dispatch({ type: "role/changed", role });
  }

  /** Заменяет контакты, пароль и согласия введёнными значениями. */
  function changeAccount(account: RegistrationAccount) {
    dispatch({ type: "account/changed", account });
  }

  /** Запоминает текст поиска и выбранную организацию. */
  function changeCompany(company: RegistrationCompany) {
    dispatch({ type: "company/changed", company });
  }

  /** Обновляет направления заказчика и анкету аудита. */
  function changeCustomer(customer: CustomerRegistration) {
    dispatch({ type: "customer/changed", customer });
  }

  /** Обновляет анкеты, документы и настройки исполнителя. */
  function changeExpert(expert: ExpertRegistration) {
    dispatch({ type: "expert/changed", expert });
  }

  /** Обновляет лицензии, членство СРО и документы держателя. */
  function changeHolder(holder: HolderRegistration) {
    dispatch({ type: "holder/changed", holder });
  }

  /** Отправляет регистрацию; успешный ответ передаёт окно на подтверждение почты. */
  async function submit() {
    if (state.isSubmitting) {
      return;
    }

    const error = validateRegistration(state);

    if (error) {
      showError(error);
      return;
    }

    dispatch({ type: "registration/started" });
    onBusyChange?.(true);

    try {
      if (state.role === "EXPERT") {
        await submitExpert(state.account, state.expert, readReferralCode());
      } else {
        const company = state.company.selected;

        if (!company) {
          throw new Error("Выберите организацию из подсказок по ИНН");
        }

        if (state.role === "CUSTOMER") {
          await submitCustomer(state.account, state.customer, company);
        } else {
          await submitHolder(state.account, state.holder, company);
        }
      }

      clearReferralCode();
      onRegistered(state.account.email.trim(), state.role);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось зарегистрироваться");
    } finally {
      dispatch({ type: "registration/finished" });
      onBusyChange?.(false);
    }
  }

  return {
    state,
    files,
    submit,
    changeRole,
    changeAccount,
    changeCompany,
    changeCustomer,
    changeExpert,
    changeHolder,
  };
}

