import { Button, FullSheet, SheetHero } from "@/shared/ui";
import { type Role } from "@/shared/services/api";
import { useRegister, type StepKey } from "../model/use-register";
import { AccountFields } from "./fields/account-fields";
import { ConsentFields } from "./fields/consent-fields";
import { CustomerFields } from "./fields/customer-fields";
import { ExpertFields } from "./fields/expert-fields";
import { LicenseFields } from "./fields/license-fields";
import { LicenseDocsFields } from "./fields/license-docs-fields";
import { CodeStep } from "./code-step";
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

  const actions =
    stepKey === "code" ? (
      <Button onClick={() => void submitCode()} loading={state.busy} disabled={!stepReady.code}>
        Подтвердить
      </Button>
    ) : (
      <>
        {state.step > 1 && (
          <Button variant="outline" onClick={back}>
            Назад
          </Button>
        )}
        <Button onClick={next} loading={state.busy} disabled={!stepReady[stepKey]}>
          {stepKey === "account" ? "Зарегистрироваться" : "Далее"}
        </Button>
      </>
    );

  return (
    <FullSheet
      open={role !== null}
      onClose={onClose}
      scrollKey={state.step}
      hero={
        meta && (
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
        )
      }
      footer={actions}
    >
      {role && (
        <div className={s.form}>
          {stepKey === "org" && <CustomerFields state={state} dispatch={dispatch} />}
          {stepKey === "profile" && <ExpertFields state={state} dispatch={dispatch} />}
          {stepKey === "license" && <LicenseFields state={state} dispatch={dispatch} />}
          {stepKey === "docs" && <LicenseDocsFields state={state} dispatch={dispatch} />}
          {stepKey === "account" && (
            <>
              <AccountFields state={state} dispatch={dispatch} phoneRequired={role === "LICENSE_HOLDER"} />
              <ConsentFields consents={state.consents} dispatch={dispatch} />
            </>
          )}
          {stepKey === "code" && (
            <CodeStep email={state.email} code={state.code} dispatch={dispatch} onResend={() => void resend()} />
          )}
        </div>
      )}
    </FullSheet>
  );
}
