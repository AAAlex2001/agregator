"use client";

import type { FormEvent } from "react";
import type { ContactOfferFields as ContactOfferValues } from "@/entities/expert-contact";
import { AutofillGuard } from "@/shared/ui/autofill-guard";
import { Button } from "@/shared/ui/button";
import { useNotifications } from "@/shared/ui/notifications";
import type { RegisterFormOptions } from "../../model/types";
import { useRegisterForm } from "../../model/use-register-form";
import { AccountFields } from "../account-fields";
import { CompanyFields } from "../company-fields";
import { ContactOfferFields } from "../contact-offer-fields";
import { CustomerFields } from "../customer-fields";
import { ExpertFields } from "../expert-fields";
import { HolderFields } from "../holder-fields";
import { NameFields } from "../name-fields";
import { RoleSelect } from "../role-select";
import styles from "./style.module.scss";

/** Собирает ролевую анкету, общие поля и отправку регистрации в исходном порядке. */
export function RegisterForm(props: RegisterFormOptions) {
  const form = useRegisterForm(props);
  const { state } = form;
  const { account } = state;
  const { showError } = useNotifications();

  /** Передаёт имя в общие поля аккаунта. */
  function changeFirstName(firstName: string) {
    form.changeAccount({
      ...account,
      firstName,
    });
  }

  /** Передаёт фамилию в общие поля аккаунта. */
  function changeLastName(lastName: string) {
    form.changeAccount({
      ...account,
      lastName,
    });
  }

  /** Обновляет условия доступа к контактам исполнителя. */
  function changeContactOffer(contactOffer: ContactOfferValues) {
    form.changeExpert({
      ...state.expert,
      contactOffer,
    });
  }

  /** Проверяет обязательные поля браузером перед запуском регистрации. */
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (state.isSubmitting) {
      return;
    }

    if (!event.currentTarget.checkValidity()) {
      showError("Заполните обязательные поля");
      event.currentTarget.reportValidity();
      return;
    }

    void form.submit();
  }

  return (
    <form
      onSubmit={submit}
      className={styles.form}
      noValidate
      autoComplete="off"
      data-lpignore="true"
      data-1p-ignore="true"
    >
      <AutofillGuard idPrefix="register" />

      {!props.preset && (
        <RoleSelect
          value={state.role}
          onChange={form.changeRole}
          disabled={state.isSubmitting}
        />
      )}

      {state.role === "CUSTOMER" && (
        <>
          <CustomerFields
            value={state.customer}
            onChange={form.changeCustomer}
          />
          <NameFields
            firstName={account.firstName}
            lastName={account.lastName}
            onFirstNameChange={changeFirstName}
            onLastNameChange={changeLastName}
          />
          <CompanyFields
            value={state.company}
            onChange={form.changeCompany}
          />
        </>
      )}

      {state.role === "EXPERT" && (
        <ExpertFields
          value={state.expert}
          onChange={form.changeExpert}
          files={form.files}
        />
      )}

      {state.role === "LICENSE_HOLDER" && (
        <>
          <HolderFields
            value={state.holder}
            onChange={form.changeHolder}
            files={form.files}
          />
          <CompanyFields
            value={state.company}
            onChange={form.changeCompany}
          />
        </>
      )}

      {state.role === "EXPERT" && (
        <>
          <ContactOfferFields
            value={state.expert.contactOffer}
            onChange={changeContactOffer}
          />
          <NameFields
            firstName={account.firstName}
            lastName={account.lastName}
            onFirstNameChange={changeFirstName}
            onLastNameChange={changeLastName}
          />
        </>
      )}

      <AccountFields
        value={account}
        onChange={form.changeAccount}
      />

      <Button
        type="submit"
        variant="chat"
        size="lg"
        fullWidth
        isLoading={state.isSubmitting}
      >
        Зарегистрироваться
      </Button>
    </form>
  );
}

