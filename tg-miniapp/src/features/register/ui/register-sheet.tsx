import { Button, FullSheet, SheetHero } from "@/shared/ui";
import { type Role } from "@/shared/services/api";
import { useRegister } from "../model/use-register";
import { DataStep } from "./data-step";
import { CodeStep } from "./code-step";

const ROLE_META: Record<Role, { light: string; dark: string; title: string; desc: string }> = {
  CUSTOMER: {
    light: "/profile-hero/customer-light.webp",
    dark: "/profile-hero/customer-dark.webp",
    title: "Заказчик",
    desc: "Размещайте заказы и находите аттестованных экспертов",
  },
  EXPERT: {
    light: "/profile-hero/expert-light.webp",
    dark: "/profile-hero/expert-dark.webp",
    title: "Эксперт",
    desc: "Находите проекты и участвуйте в тендерах",
  },
  LICENSE_HOLDER: {
    light: "/profile-hero/license-light.webp",
    dark: "/profile-hero/license-dark.webp",
    title: "Держатель лицензии",
    desc: "Предоставляйте лицензию ЭПБ ОПО для работы экспертов",
  },
};

export function RegisterSheet({ role, onClose }: { role: Role | null; onClose: () => void }) {
  const { state, dispatch, isLicense, canSubmit, submitData, submitCode, resend } = useRegister(role);
  const meta = role ? ROLE_META[role] : null;

  const actions =
    state.step === 1 ? (
      <Button onClick={() => void submitData()} loading={state.busy} disabled={!canSubmit}>
        Далее
      </Button>
    ) : (
      <>
        <Button variant="outline" onClick={() => dispatch({ type: "step", value: 1 })}>
          Назад
        </Button>
        <Button onClick={() => void submitCode()} loading={state.busy} disabled={state.code.trim().length < 4}>
          Подтвердить
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
            textDark
            label={`Шаг ${state.step} из 2`}
            title={meta.title}
            desc={meta.desc}
            step={state.step}
            total={2}
            onClose={onClose}
          />
        )
      }
      footer={actions}
    >
      {role &&
        (state.step === 1 ? (
          <DataStep role={role} isLicense={isLicense} state={state} dispatch={dispatch} />
        ) : (
          <CodeStep email={state.email} code={state.code} dispatch={dispatch} onResend={() => void resend()} />
        ))}
    </FullSheet>
  );
}
