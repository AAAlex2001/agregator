import { useState, type ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/entites/session";
import { ApiError, type Role } from "@/shared/services/api";
import { emitError } from "@/shared/services/error-bus";
import { tapHaptic } from "@/shared/services/telegram";
import { Button, TextField, BottomSheet, Logo } from "@/shared/ui";
import { MailIcon, LockIcon } from "@/shared/ui/icons/interface";
import { CustomerRoleIcon, ExpertRoleIcon, LicenseRoleIcon } from "@/shared/ui/icons/roles";
import s from "./style.module.scss";

const ROLE_META: Record<Role, { label: string; Icon: ComponentType<{ size?: number }> }> = {
  CUSTOMER: { label: "Вы — заказчик", Icon: CustomerRoleIcon },
  EXPERT: { label: "Вы — эксперт", Icon: ExpertRoleIcon },
  LICENSE_HOLDER: { label: "Вы — держатель лицензии", Icon: LicenseRoleIcon },
};

function availableRoles(error: unknown): Role[] | null {
  if (!(error instanceof ApiError) || error.status !== 409) return null;
  const roles = (error.body as { detail?: { available_roles?: Role[] } } | null)?.detail?.available_roles;
  return roles && roles.length ? roles : null;
}

export function AuthPage() {
  const { signInLink } = useSession();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [rolesOpen, setRolesOpen] = useState(false);

  const submit = async (role?: Role) => {
    setLoading(true);
    try {
      await signInLink(email.trim(), password, role);
      navigate("/", { replace: true });
    } catch (e) {
      const avail = availableRoles(e);
      if (avail) {
        setRoles(avail);
        setRolesOpen(true);
        return;
      }
      emitError(e instanceof Error ? e.message : "Не удалось войти");
    } finally {
      setLoading(false);
    }
  };

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
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            icon={<LockIcon width={20} height={20} />}
            password
            autoComplete="current-password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" loading={loading}>
            Войти
          </Button>
        </form>
      </div>

      <BottomSheet open={rolesOpen} title="Под какой ролью войти?" onClose={() => setRolesOpen(false)}>
        <p className={s.roleHint}>На эти данные зарегистрировано несколько аккаунтов</p>
        <div className={s.roleList}>
          {roles.map((r) => {
            const { label, Icon } = ROLE_META[r];
            return (
              <button
                key={r}
                className={s.roleBtn}
                onClick={() => {
                  tapHaptic();
                  setRolesOpen(false);
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
          <Button variant="outline" onClick={() => setRolesOpen(false)}>
            Отмена
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}
