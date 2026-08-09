"use client";

import Button from "@/source/shared/ui/Button";
import AutofillGuard from "@/source/shared/ui/AutofillGuard";
import Tabs from "@/source/shared/ui/Tabs";
import type { AuthPreset } from "@/source/shared/lib/auth-modal";
import type { UserRole } from "@/source/entities/user";
import { useRegister } from "../model/use-register";
import { CustomerFields } from "./CustomerFields";
import { ExpertFields } from "./ExpertFields";
import { HolderFields } from "./HolderFields";
import { ContactBlock } from "./ContactBlock";
import { ExpertContactBlock } from "./ExpertContactBlock";
import { PasswordBlock } from "./PasswordBlock";
import { AgreementsBlock } from "./AgreementsBlock";
import s from "./register-form.module.scss";

const ROLE_TABS = [
  { id: "CUSTOMER", label: "Заказчик" },
  { id: "EXPERT", label: "Исполнитель" },
  { id: "LICENSE_HOLDER", label: "Держатель разрешительных документов" },
];

interface Props {
  preset: AuthPreset | null;
  onRegistered: (email: string, role: UserRole) => void;
}

export function RegisterForm({ preset, onRegistered }: Props) {
  const { state, dispatch, submit } = useRegister(preset, onRegistered);
  const isHolder = state.role === "LICENSE_HOLDER";

  return (
    <div className={s.stepContent}>
      <form
        onSubmit={submit}
        className={s.form}
        autoComplete="off"
        data-lpignore="true"
        data-1p-ignore="true"
      >
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
        {state.role === "EXPERT" && <ExpertFields state={state} dispatch={dispatch} />}
        {isHolder && <HolderFields state={state} dispatch={dispatch} />}

        <ContactBlock state={state} dispatch={dispatch} showPhoneHint={!isHolder} />

        {state.role === "EXPERT" && <ExpertContactBlock state={state} dispatch={dispatch} />}

        <PasswordBlock state={state} dispatch={dispatch} />

        <AgreementsBlock state={state} dispatch={dispatch} />

        <Button type="submit" variant="chat" size="lg" fullWidth isLoading={state.waiting}>
          Зарегистрироваться
        </Button>
      </form>
    </div>
  );
}
