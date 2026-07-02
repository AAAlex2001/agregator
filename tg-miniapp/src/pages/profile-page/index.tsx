import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@/features/session";
import { Screen } from "@/widgets/app-shell";
import { Spinner, Toggle } from "@/shared/ui";
import { ThemeSheet } from "@/features/theme-switch";
import { RoleTabs } from "@/features/role-switch";
import { hapticEnabled, setHapticEnabled } from "@/shared/services/telegram";
import {
  BellIcon,
  CreditIcon,
  LogoutIcon,
  MailIcon,
  MoonIcon,
  PhoneIcon,
  UserIcon,
  VibrateIcon,
} from "@/shared/ui/icons/interface";
import { formatPhone } from "@/shared/lib/phone";
import { ProfileHero } from "./ui/profile-hero";
import { SettingRow } from "./ui/setting-row";
import s from "./style.module.scss";

const ROLE_META = {
  EXPERT: { kind: "expert", noun: "Эксперт" },
  CUSTOMER: { kind: "customer", noun: "Заказчик" },
  LICENSE_HOLDER: { kind: "license", noun: "Лицензиат" },
} as const;

export function ProfilePage() {
  const navigate = useNavigate();
  const { profile, role, signOut } = useSession();
  const [themeOpen, setThemeOpen] = useState(false);
  const [haptic, setHaptic] = useState(hapticEnabled);
  const meta = ROLE_META[role ?? "CUSTOMER"];

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
      hero={<ProfileHero name={name} roleKind={meta.kind} roleNoun={meta.noun} />}
    >
      <RoleTabs />

      <p className={s.groupTitle}>Общая информация</p>
      <div className={s.group}>
        <SettingRow icon={<UserIcon width={19} height={19} />} label="ФИО" value={name} onClick={() => navigate("/edit-name")} />
        <SettingRow icon={<PhoneIcon width={19} height={19} />} label="Телефон" value={profile.phone ? formatPhone(profile.phone) : "—"} onClick={() => navigate("/edit-phone")} />
        <SettingRow icon={<MailIcon width={19} height={19} />} label="Почта" value={profile.email || "—"} onClick={() => navigate("/edit-email")} />
      </div>

      {role === "EXPERT" && (
        <>
          <p className={s.groupTitle}>Оплата</p>
          <div className={s.group}>
            <SettingRow icon={<CreditIcon width={19} height={19} />} label="Тарифы" onClick={() => navigate("/pricing")} />
          </div>
        </>
      )}

      <p className={s.groupTitle}>Управление</p>
      <div className={s.group}>
        <SettingRow icon={<BellIcon width={19} height={19} />} label="Уведомления" onClick={() => navigate("/notifications")} />
      </div>

      <p className={s.groupTitle}>Системные настройки</p>
      <div className={s.group}>
        <SettingRow
          icon={<MoonIcon width={19} height={19} />}
          label="Тема оформления"
          onClick={() => setThemeOpen(true)}
        />
        <SettingRow
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
        <SettingRow
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
