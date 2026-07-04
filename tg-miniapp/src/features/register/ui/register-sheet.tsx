import { Button, FullSheet, SheetHero } from "@/shared/ui";
import { type Role } from "@/shared/services/api";
import { useRegister, type StepKey } from "../model/use-register";
import { CompanyStep } from "./steps/company-step";
import { ExpertStep } from "./steps/expert-step";
import { LicenseStep } from "./steps/license-step";
import { DocsStep } from "./steps/docs-step";
import { AccountStep } from "./steps/account-step";
import { CodeStep } from "./steps/code-step";
import s from "./register-sheet.module.scss";

const ROLE_META: Record<Role, { light: string; dark: string; title: string }> = {
  CUSTOMER: {
    light: "/profile-hero/customer-light.webp",
    dark: "/profile-hero/customer-dark.webp",
    title: "Заказчик",
  },
  EXPERT: {
    light: "/profile-hero/expert-light.webp",
    dark: "/profile-hero/expert-dark.webp",
    title: "Эксперт",
  },
  LICENSE_HOLDER: {
    light: "/profile-hero/license-light.webp",
    dark: "/profile-hero/license-dark.webp",
    title: "Держатель лицензии",
  },
};

const STEP_DESC: Record<StepKey, string> = {
  org: "Укажите вашу организацию",
  profile: "Расскажите о себе",
  license: "Данные лицензии ЭПБ ОПО",
  docs: "Документы — можно добавить позже",
  account: "Почта, телефон и пароль",
  code: "Подтвердите почту кодом из письма",
};

export function RegisterSheet({ role, onClose }: { role: Role | null; onClose: () => void }) {
  const { state, dispatch, stepKey, total, stepReady, next, back, submitCode, resend } = useRegister(role);
  const meta = role ? ROLE_META[role] : null;

  const primaryLabel = stepKey === "code" ? "Подтвердить" : stepKey === "account" ? "Зарегистрироваться" : "Далее";
  const onPrimary = stepKey === "code" ? () => void submitCode() : next;

  const actions = role ? (
    <>
      {state.step > 1 && stepKey !== "code" ? (
        <Button variant="outline" onClick={back} disabled={state.busy}>
          Назад
        </Button>
      ) : null}
      <Button onClick={onPrimary} loading={state.busy} disabled={!stepReady[stepKey]}>
        {primaryLabel}
      </Button>
    </>
  ) : null;

  return (
    <FullSheet
      open={role !== null}
      onClose={onClose}
      scrollKey={state.step}
      hero={
        meta ? (
          <SheetHero
            light={meta.light}
            dark={meta.dark}
            label={`Шаг ${state.step} из ${total}`}
            title={meta.title}
            desc={STEP_DESC[stepKey]}
            step={state.step}
            total={total}
            onClose={onClose}
          />
        ) : null
      }
      footer={actions}
    >
      {role ? (
        <div className={s.body}>
          {stepKey === "org" ? <CompanyStep state={state} dispatch={dispatch} /> : null}
          {stepKey === "profile" ? <ExpertStep state={state} dispatch={dispatch} /> : null}
          {stepKey === "license" ? <LicenseStep state={state} dispatch={dispatch} /> : null}
          {stepKey === "docs" ? <DocsStep state={state} dispatch={dispatch} /> : null}
          {stepKey === "account" ? (
            <AccountStep state={state} dispatch={dispatch} phoneRequired={role === "LICENSE_HOLDER"} />
          ) : null}
          {stepKey === "code" ? (
            <CodeStep state={state} dispatch={dispatch} onResend={() => void resend()} />
          ) : null}
        </div>
      ) : null}
    </FullSheet>
  );
}
