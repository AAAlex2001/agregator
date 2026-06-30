import { useEffect, useState } from "react";
import cn from "classnames";
import { BottomSheet, Button, TextField } from "@/shared/ui";
import { useSession } from "@/entites/session";
import { getAvailableRoles, switchRole, type AvailableRole } from "@/entites/profile";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic, tapHaptic } from "@/shared/services/telegram";
import type { Role } from "@/shared/services/api";
import s from "./role-tabs.module.scss";

const LABEL: Record<Role, string> = {
  CUSTOMER: "Заказчик",
  EXPERT: "Эксперт",
  LICENSE_HOLDER: "Лицензиат",
};

const KIND: Record<Role, string> = {
  EXPERT: "expert",
  CUSTOMER: "customer",
  LICENSE_HOLDER: "license",
};

export function RoleTabs() {
  const { role, reloadProfile } = useSession();
  const [available, setAvailable] = useState<AvailableRole[]>([]);
  const [target, setTarget] = useState<Role | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getAvailableRoles()
      .then((resp) => setAvailable(resp.roles))
      .catch(() => setAvailable([]));
  }, []);

  if (!role) return null;

  const tabs: Role[] = [role, ...available.map((a) => a.role)];

  const pick = (next: Role) => {
    if (next === role) return;
    const item = available.find((a) => a.role === next);
    if (item && !item.email_verified) {
      emitError("Сначала подтвердите почту для этой роли");
      return;
    }
    tapHaptic();
    setPassword("");
    setTarget(next);
  };

  const confirm = async () => {
    if (!target) return;
    setBusy(true);
    try {
      await switchRole(target, password);
      notifyHaptic("success");
      await reloadProfile();
      setTarget(null);
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось сменить роль");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={s.wrap}>
      <p className={s.label}>Доступные роли</p>
      <div className={s.tabs}>
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            className={cn(s.tab, item === role && s.active, item === role && s[KIND[item]])}
            onClick={() => pick(item)}
          >
            {LABEL[item]}
          </button>
        ))}
      </div>

      <BottomSheet
        open={target !== null}
        title={target ? `Войти как ${LABEL[target].toLowerCase()}` : ""}
        onClose={() => setTarget(null)}
      >
        <div className={s.confirm}>
          <p className={s.hint}>Введите пароль от аккаунта этой роли.</p>
          <TextField
            password
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={s.actions}>
            <Button variant="outline" onClick={() => setTarget(null)}>
              Отмена
            </Button>
            <Button onClick={() => void confirm()} loading={busy} disabled={password.length < 6}>
              Войти
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
}
