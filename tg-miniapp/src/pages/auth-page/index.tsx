import { type ComponentType } from "react";
import { type Role } from "@/shared/services/api";
import { tapHaptic } from "@/shared/services/telegram";
import { useAuthForm } from "@/features/session";
import { Button, TextField, BottomSheet, Logo } from "@/shared/ui";
import { MailIcon, LockIcon } from "@/shared/ui/icons/interface";
import { CustomerRoleIcon, ExpertRoleIcon, LicenseRoleIcon } from "@/shared/ui/icons/roles";
import s from "./style.module.scss";

const ROLE_META: Record<Role, { label: string; Icon: ComponentType<{ size?: number }> }> = {
  CUSTOMER: { label: "Вы — заказчик", Icon: CustomerRoleIcon },
  EXPERT: { label: "Вы — эксперт", Icon: ExpertRoleIcon },
  LICENSE_HOLDER: { label: "Вы — держатель лицензии", Icon: LicenseRoleIcon },
};

export function AuthPage() {
  const { state, dispatch, submit } = useAuthForm();

  return (
    <div className={s.page}>
      <div className={s.hero}>
        <Logo size={62} className={s.logo} />
        <h1 className={s.heroTitle}>Добро пожаловать!</h1>
        <p className={s.heroSub}>Войдите в свой аккаунт</p>
      </div>

      <div className={s.card}>
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
        </form>
      </div>

      <BottomSheet open={state.rolesOpen} title="Под какой ролью войти?" onClose={() => dispatch({ type: "closeRoles" })}>
        <p className={s.roleHint}>На эти данные зарегистрировано несколько аккаунтов</p>
        <div className={s.roleList}>
          {state.roles.map((r) => {
            const { label, Icon } = ROLE_META[r];
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
    </div>
  );
}
