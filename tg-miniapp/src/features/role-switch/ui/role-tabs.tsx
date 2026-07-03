import { BottomSheet, Button, TextField } from "@/shared/ui";
import { Tabs } from "@/shared/ui/tabs";
import type { Role } from "@/shared/services/api";
import { useRoleSwitch } from "../model/use-role-switch";
import s from "./role-tabs.module.scss";

const LABEL: Record<Role, string> = {
  CUSTOMER: "Заказчик",
  EXPERT: "Эксперт",
  LICENSE_HOLDER: "Лицензиат",
};

export function RoleTabs() {
  const { role, availableRoles, state, dispatch, pick, confirm } = useRoleSwitch();

  if (!role || availableRoles.length < 2) return null;

  return (
    <div className={s.wrap}>
      <p className={s.label}>Доступные роли</p>
      <Tabs
        tabs={availableRoles.map((a) => ({ key: a.role, label: LABEL[a.role] }))}
        active={role}
        onChange={(key) => pick(key as Role)}
      />

      <BottomSheet
        open={state.target !== null}
        title={state.target ? `Войти как ${LABEL[state.target].toLowerCase()}` : ""}
        onClose={() => dispatch({ type: "close" })}
      >
        <div className={s.confirm}>
          <p className={s.hint}>Введите пароль от аккаунта этой роли.</p>
          <TextField
            password
            placeholder="Пароль"
            value={state.password}
            onChange={(e) => dispatch({ type: "password", value: e.target.value })}
          />
          <div className={s.actions}>
            <Button variant="outline" onClick={() => dispatch({ type: "close" })}>
              Отмена
            </Button>
            <Button onClick={() => void confirm()} loading={state.busy} disabled={state.password.length < 6}>
              Войти
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
