import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import cn from "classnames";
import { useSession } from "@/entites/session";
import { Screen } from "@/widgets/app-shell";
import { Spinner, Toggle } from "@/shared/ui";
import { ThemeSheet } from "@/features/theme-switch";
import { RoleSheet } from "@/features/role-switch";
import { hapticEnabled, setHapticEnabled, tapHaptic } from "@/shared/services/telegram";
import {
  BellIcon,
  ChevronRightIcon,
  CreditIcon,
  LogoutIcon,
  MailIcon,
  MoonIcon,
  PhoneIcon,
  SwitchRoleIcon,
  UserIcon,
  VibrateIcon,
} from "@/shared/ui/icons/interface";
import { CustomerRoleIcon, ExpertRoleIcon, LicenseRoleIcon } from "@/shared/ui/icons/roles";
import { formatPhone } from "@/shared/lib/phone";
import s from "./style.module.scss";

const ROLE_BANNER = {
  EXPERT: { kind: "expert", noun: "Эксперт", icon: <ExpertRoleIcon size={66} /> },
  CUSTOMER: { kind: "customer", noun: "Заказчик", icon: <CustomerRoleIcon size={66} /> },
  LICENSE_HOLDER: { kind: "license", noun: "Лицензиат", icon: <LicenseRoleIcon size={70} /> },
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
  const [roleOpen, setRoleOpen] = useState(false);
  const [haptic, setHaptic] = useState(hapticEnabled);

  if (!profile) {
    return (
      <Screen bare heading="Профиль" panel>
        <Spinner page />
      </Screen>
    );
  }

  const name = [profile.last_name, profile.first_name].filter(Boolean).join(" ") || "—";
  const banner = ROLE_BANNER[role ?? "CUSTOMER"];

  return (
    <Screen bare heading="Профиль" panel>
      <div className={cn(s.banner, s[banner.kind])}>
        <div className={s.bannerText}>
          <p className={s.name}>{name}</p>
          <span className={s.roleBadge}>Вы — {banner.noun}</span>
        </div>
        <span className={s.bannerIcon}>{banner.icon}</span>
      </div>

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
        <Row icon={<SwitchRoleIcon width={19} height={19} />} label="Смена роли" onClick={() => setRoleOpen(true)} />
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
      <RoleSheet open={roleOpen} onClose={() => setRoleOpen(false)} />
    </Screen>
  );
}
