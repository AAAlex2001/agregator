import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { useSession } from "@/entites/session";
import { Screen } from "@/widgets/app-shell";
import { Card, Spinner } from "@/shared/ui";
import { ThemeSheet } from "@/features/theme-switch";
import { hapticEnabled, setHapticEnabled, tapHaptic } from "@/shared/services/telegram";
import {
  ChevronRightIcon,
  CreditIcon,
  LogoutIcon,
  MailIcon,
  MoonIcon,
  PhoneIcon,
  UserIcon,
  VibrateIcon,
} from "@/shared/ui/icons/interface";
import s from "./style.module.scss";

function roleLabel(role: string | null): string {
  if (role === "EXPERT") return "Эксперт";
  if (role === "LICENSE_HOLDER") return "Держатель лицензии";
  return "Заказчик";
}

function Row({
  icon,
  label,
  value,
  onClick,
  action,
  danger,
}: {
  icon: ReactNode;
  label: string;
  value?: ReactNode;
  onClick?: () => void;
  action?: ReactNode;
  danger?: boolean;
}) {
  const className = cn(s.row, { [s.danger]: danger });
  const content = (
    <>
      <span className={s.rowIcon}>{icon}</span>
      <span className={s.rowLabel}>{label}</span>
      {value != null && <span className={s.rowValue}>{value}</span>}
      {action ?? (onClick && <ChevronRightIcon className={s.rowChev} width={18} height={18} />)}
    </>
  );
  if (!onClick) return <div className={className}>{content}</div>;
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        tapHaptic();
        onClick();
      }}
    >
      {content}
    </button>
  );
}

export function ProfilePage() {
  const navigate = useNavigate();
  const { profile, role, signOut } = useSession();
  const [themeOpen, setThemeOpen] = useState(false);
  const [haptic, setHaptic] = useState(hapticEnabled);

  if (!profile) {
    return (
      <Screen title="Профиль">
        <Spinner page />
      </Screen>
    );
  }

  const name = [profile.last_name, profile.first_name].filter(Boolean).join(" ") || "—";

  const toggleHaptic = () => {
    const next = !haptic;
    setHapticEnabled(next);
    setHaptic(next);
    if (next) tapHaptic();
  };

  return (
    <Screen title="Профиль">
      <Card className={s.head}>
        <span className={s.avatar}>
          <UserIcon width={26} height={26} />
        </span>
        <div className={s.headText}>
          <p className={s.name}>{name}</p>
          <p className={s.role}>{roleLabel(role)}</p>
        </div>
      </Card>

      <p className={s.groupTitle}>Общая информация</p>
      <div className={s.group}>
        <Row icon={<UserIcon width={19} height={19} />} label="ФИО" value={name} />
        <Row icon={<PhoneIcon width={19} height={19} />} label="Телефон" value={profile.phone || "—"} />
        <Row icon={<MailIcon width={19} height={19} />} label="Почта" value={profile.email || "—"} />
      </div>

      <p className={s.groupTitle}>Управление</p>
      <div className={s.group}>
        {role === "EXPERT" && (
          <Row icon={<CreditIcon width={19} height={19} />} label="Тарифы" onClick={() => navigate("/pricing")} />
        )}
        <Row
          icon={<MoonIcon width={19} height={19} />}
          label="Тема оформления"
          onClick={() => {
            tapHaptic();
            setThemeOpen(true);
          }}
        />
        <Row
          icon={<VibrateIcon width={19} height={19} />}
          label="Вибрация"
          action={
            <button
              type="button"
              className={cn(s.toggle, { [s.toggleOn]: haptic })}
              onClick={toggleHaptic}
              aria-label="Вибрация"
            >
              <span className={s.toggleKnob} />
            </button>
          }
        />
        <Row
          icon={<LogoutIcon width={19} height={19} />}
          label="Выйти"
          danger
          onClick={() => void signOut()}
        />
      </div>

      <ThemeSheet open={themeOpen} onClose={() => setThemeOpen(false)} />
    </Screen>
  );
}
