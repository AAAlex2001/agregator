import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { useSession } from "@/entites/session";
import { Screen } from "@/widgets/app-shell";
import { Spinner, Toggle } from "@/shared/ui";
import { ThemeSheet } from "@/features/theme-switch";
import { RoleTabs } from "@/features/role-switch";
import {
  hapticEnabled,
  restoreHeaderColor,
  setHapticEnabled,
  setHeaderColor,
  tapHaptic,
} from "@/shared/services/telegram";
import {
  BellIcon,
  ChevronRightIcon,
  CreditIcon,
  LogoutIcon,
  MailIcon,
  MoonIcon,
  PhoneIcon,
  UserIcon,
  VibrateIcon,
} from "@/shared/ui/icons/interface";
import { CustomerRoleIcon, ExpertRoleIcon, LicenseRoleIcon } from "@/shared/ui/icons/roles";
import { formatPhone } from "@/shared/lib/phone";
import s from "./style.module.scss";

const ROLE_META = {
  EXPERT: { kind: "expert", noun: "Эксперт", Icon: ExpertRoleIcon, header: "#ff9f2e" },
  CUSTOMER: { kind: "customer", noun: "Заказчик", Icon: CustomerRoleIcon, header: "#4a86ee" },
  LICENSE_HOLDER: { kind: "license", noun: "Лицензиат", Icon: LicenseRoleIcon, header: "#34c759" },
} as const;

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
  const meta = ROLE_META[role ?? "CUSTOMER"];

  useEffect(() => {
    setHeaderColor(meta.header);
    return () => restoreHeaderColor();
  }, [meta.header]);

  if (!profile) {
    return (
      <Screen bare panel>
        <Spinner page />
      </Screen>
    );
  }

  const name = [profile.last_name, profile.first_name].filter(Boolean).join(" ") || "—";

  return (
    <Screen
      bare
      panel
      hero={
        <div className={cn(s.hero, s[`hero_${meta.kind}`])}>
          <div className={s.heroPattern} aria-hidden="true">
            {Array.from({ length: 120 }).map((_, i) => (
              <meta.Icon key={i} size={28} />
            ))}
          </div>
          <div className={s.heroInner}>
            <p className={s.heroName}>{name}</p>
            <p className={s.heroRole}>Вы — {meta.noun}</p>
          </div>
          <span className={s.heroShade} />
        </div>
      }
    >
      <RoleTabs />

      <p className={s.groupTitle}>Общая информация</p>
      <div className={s.group}>
        <Row icon={<UserIcon width={19} height={19} />} label="ФИО" value={name} onClick={() => navigate("/edit-name")} />
        <Row icon={<PhoneIcon width={19} height={19} />} label="Телефон" value={profile.phone ? formatPhone(profile.phone) : "—"} onClick={() => navigate("/edit-phone")} />
        <Row icon={<MailIcon width={19} height={19} />} label="Почта" value={profile.email || "—"} onClick={() => navigate("/edit-email")} />
      </div>

      {role === "EXPERT" && (
        <>
          <p className={s.groupTitle}>Оплата</p>
          <div className={s.group}>
            <Row icon={<CreditIcon width={19} height={19} />} label="Тарифы" onClick={() => navigate("/pricing")} />
          </div>
        </>
      )}

      <p className={s.groupTitle}>Управление</p>
      <div className={s.group}>
        <Row icon={<BellIcon width={19} height={19} />} label="Уведомления" onClick={() => navigate("/notifications")} />
      </div>

      <p className={s.groupTitle}>Системные настройки</p>
      <div className={s.group}>
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
            <Toggle
              on={haptic}
              onChange={(next) => {
                setHapticEnabled(next);
                setHaptic(next);
              }}
            />
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
