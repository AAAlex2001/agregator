import { useEffect, useState } from "react";
import { BottomSheet, Button, Spinner, TextField } from "@/shared/ui";
import { ChevronRightIcon } from "@/shared/ui/icons/interface";
import { useSession } from "@/entites/session";
import { getAvailableRoles, switchRole, type AvailableRole } from "@/entites/profile";
import { emitError } from "@/shared/services/error-bus";
import { notifyHaptic, tapHaptic } from "@/shared/services/telegram";
import type { Role } from "@/shared/services/api";
import s from "./role-sheet.module.scss";

const LABEL: Record<Role, string> = {
  CUSTOMER: "Заказчик",
  EXPERT: "Эксперт",
  LICENSE_HOLDER: "Держатель лицензии",
};

export function RoleSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { reloadProfile } = useSession();
  const [roles, setRoles] = useState<AvailableRole[] | null>(null);
  const [target, setTarget] = useState<Role | null>(null);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTarget(null);
    setPassword("");
    setRoles(null);
    getAvailableRoles()
      .then((resp) => setRoles(resp.roles))
      .catch(() => setRoles([]));
  }, [open]);

  const confirm = async () => {
    if (!target) return;
    setBusy(true);
    try {
      await switchRole(target, password);
      notifyHaptic("success");
      await reloadProfile();
      onClose();
    } catch (e) {
      emitError(e instanceof Error ? e.message : "Не удалось сменить роль");
    } finally {
      setBusy(false);
    }
  };

  const title = target ? `Войти как ${LABEL[target].toLowerCase()}` : "Смена роли";

  return (
    <BottomSheet open={open} title={title} onClose={onClose}>
      {target ? (
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
              Назад
            </Button>
            <Button onClick={() => void confirm()} loading={busy} disabled={password.length < 6}>
              Войти
            </Button>
          </div>
        </div>
      ) : roles === null ? (
        <div className={s.loading}>
          <Spinner />
        </div>
      ) : roles.length === 0 ? (
        <p className={s.empty}>На этой почте нет других ролей для переключения.</p>
      ) : (
        <div className={s.list}>
          {roles.map((item) => (
            <button
              key={item.role}
              type="button"
              className={s.item}
              disabled={!item.email_verified}
              onClick={() => {
                tapHaptic();
                setTarget(item.role);
              }}
            >
              <span className={s.name}>Войти как {LABEL[item.role].toLowerCase()}</span>
              {item.email_verified ? (
                <ChevronRightIcon width={18} height={18} className={s.chev} />
              ) : (
                <span className={s.locked}>Подтвердите почту</span>
              )}
            </button>
          ))}
        </div>
      )}
    </BottomSheet>
  );
}
