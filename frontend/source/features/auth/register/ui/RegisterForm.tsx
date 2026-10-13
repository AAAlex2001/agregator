"use client";

import type { UserRole } from "@/source/entities/user";
import type { AuthPreset } from "@/source/shared/lib/auth-modal";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import Button from "@/source/shared/ui/Button";
import Tabs from "@/source/shared/ui/Tabs";
import { useRegister } from "../model/useRegister";
import { AgreementsBlock } from "./AgreementsBlock";
import { ContactBlock } from "./ContactBlock";
import { CustomerFields } from "./CustomerFields";
import { ExpertContactBlock } from "./ExpertContactBlock";
import { ExpertFields } from "./ExpertFields";
import { HolderFields } from "./HolderFields";
import { NameFields } from "./NameFields";
import { PasswordBlock } from "./PasswordBlock";
import s from "./RegisterForm.module.scss";

const ROLE_TABS = [
  { id: "CUSTOMER", label: "Заказчик" },
  { id: "EXPERT", label: "Исполнитель" },
  { id: "LICENSE_HOLDER", label: "Держатель разрешительных документов" },
];

interface RegisterFormProps {
  preset: AuthPreset | null;
  onRegistered: (email: string, role: UserRole) => void;
}

/** Регистрация: роль вкладками, поля под роль, контакты, пароль и согласия. С лендинга роль приходит готовой. */
export function RegisterForm({ preset, onRegistered }: RegisterFormProps) {
  const { state, dispatch, submit } = useRegister(preset, onRegistered);
  const isExpert = state.role === "EXPERT";

  return (
    <form onSubmit={submit} className={s.form} noValidate autoComplete="off" data-lpignore="true" data-1p-ignore="true">
      <AutofillGuard idPrefix="register" />

      {!preset && (
        <Tabs
          tabs={ROLE_TABS}
          activeTab={state.role}
          onTabChange={(id) => dispatch({ type: "role", value: id as UserRole })}
          variant="squared"
        />
      )}

      {state.role === "CUSTOMER" && <CustomerFields state={state} dispatch={dispatch} />}
      {isExpert && <ExpertFields state={state} dispatch={dispatch} />}
      {state.role === "LICENSE_HOLDER" && <HolderFields state={state} dispatch={dispatch} />}

      {isExpert && <ExpertContactBlock state={state} dispatch={dispatch} />}
      {isExpert && <NameFields state={state} dispatch={dispatch} />}

      <ContactBlock state={state} dispatch={dispatch} />
      <PasswordBlock state={state} dispatch={dispatch} />
      <AgreementsBlock state={state} dispatch={dispatch} />

      <Button type="submit" variant="chat" size="lg" fullWidth isLoading={state.isSubmitting}>
        Зарегистрироваться
      </Button>
    </form>
  );
}
