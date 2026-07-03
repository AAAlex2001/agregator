import { useState, type ComponentType } from "react";
import { type Role } from "@/shared/services/api";
import { openLink, tapHaptic } from "@/shared/services/telegram";
import { useAuthForm } from "@/features/session";
import { RegisterSheet } from "@/features/register";
import { Button, TextField, BottomSheet, Logo } from "@/shared/ui";
import { MailIcon, LockIcon, ChevronRightIcon } from "@/shared/ui/icons/interface";
import { CustomerRoleIcon, ExpertRoleIcon, LicenseRoleIcon } from "@/shared/ui/icons/roles";
import s from "./style.module.scss";

const REGISTER_URL = "https://plus-resurs.com/register";

const LOGIN_ROLE_META: Record<Role, { label: string; Icon: ComponentType<{ size?: number }> }> = {
  CUSTOMER: { label: "Вы — заказчик", Icon: CustomerRoleIcon },
  EXPERT: { label: "Вы — эксперт", Icon: ExpertRoleIcon },
  LICENSE_HOLDER: { label: "Вы — держатель лицензии", Icon: LicenseRoleIcon },
};

const REG_ROLES: { role: Role; label: string; desc: string; Icon: ComponentType<{ size?: number }> }[] = [
  { role: "CUSTOMER", label: "Заказчик", desc: "Размещаю заказы и ищу экспертов", Icon: CustomerRoleIcon },
  { role: "EXPERT", label: "Эксперт", desc: "Ищу проекты и участвую в тендерах", Icon: ExpertRoleIcon },
  { role: "LICENSE_HOLDER", label: "Держатель лицензии", desc: "Предоставляю лицензию ЭПБ ОПО", Icon: LicenseRoleIcon },
];

export function AuthPage() {
  const { state, dispatch, submit } = useAuthForm();
  const [mode, setMode] = useState<"welcome" | "login" | "register">("welcome");
  const [regRole, setRegRole] = useState<Role | null>(null);

  const pickRegRole = (role: Role) => {
    tapHaptic();
    if (role === "LICENSE_HOLDER") {
      openLink(REGISTER_URL);
      return;
    }
    setRegRole(role);
  };

  return (
    <div className={s.page}>
      <div className={s.hero}>
        <Logo size={62} className={s.logo} />
        <h1 className={s.heroTitle}>Добро пожаловать!</h1>
        <p className={s.heroSub}>{mode === "login" ? "Войдите в свой аккаунт" : "Войдите или создайте аккаунт"}</p>
      </div>

      <div className={s.card}>
        {mode === "welcome" && (
          <div className={s.actions}>
            <Button
              onClick={() => {
                tapHaptic();
                setMode("login");
              }}
            >
              Войти
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                tapHaptic();
                setMode("register");
              }}
            >
              Регистрация
            </Button>
          </div>
        )}

        {mode === "login" && (
          <form
            className={s.form}
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <TextField
              icon={<MailIcon width={20} height={20} />}
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="Электронная почта"
              value={state.email}
              onChange={(e) => dispatch({ type: "email", value: e.target.value })}
            />
            <TextField
              icon={<LockIcon width={20} height={20} />}
              password
              autoComplete="current-password"
              placeholder="Пароль"
              value={state.password}
              onChange={(e) => dispatch({ type: "password", value: e.target.value })}
            />
            <Button type="submit" loading={state.loading}>
              Войти
            </Button>
            <button type="button" className={s.back} onClick={() => setMode("welcome")}>
              Назад
            </button>
          </form>
        )}

        {mode === "register" && (
          <div className={s.regRoles}>
            {REG_ROLES.map((r) => (
              <button key={r.role} type="button" className={s.regRoleBtn} onClick={() => pickRegRole(r.role)}>
                <span className={s.roleIcon}>
                  <r.Icon size={26} />
                </span>
                <span className={s.regRoleText}>
                  <span className={s.regRoleLabel}>{r.label}</span>
                  <span className={s.regRoleDesc}>{r.desc}</span>
                </span>
                <ChevronRightIcon className={s.regRoleChev} width={18} height={18} />
              </button>
            ))}
            <button type="button" className={s.back} onClick={() => setMode("welcome")}>
              Назад
            </button>
          </div>
        )}
      </div>

      <BottomSheet open={state.rolesOpen} title="Под какой ролью войти?" onClose={() => dispatch({ type: "closeRoles" })}>
        <p className={s.roleHint}>На эти данные зарегистрировано несколько аккаунтов</p>
        <div className={s.roleList}>
          {state.roles.map((r) => {
            const { label, Icon } = LOGIN_ROLE_META[r];
            return (
              <button
                key={r}
                className={s.roleBtn}
                onClick={() => {
                  tapHaptic();
                  dispatch({ type: "closeRoles" });
                  void submit(r);
                }}
              >
                <span className={s.roleIcon}>
                  <Icon size={26} />
                </span>
                <span className={s.roleLabel}>{label}</span>
              </button>
            );
          })}
          <Button variant="outline" onClick={() => dispatch({ type: "closeRoles" })}>
            Отмена
          </Button>
        </div>
      </BottomSheet>

      <RegisterSheet role={regRole} onClose={() => setRegRole(null)} />
    </div>
  );
}
