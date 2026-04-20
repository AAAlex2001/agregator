import Button from "@/source/shared/ui/Button";
import Skeleton from "@/source/shared/ui/Skeleton";
import { LogoutIcon } from "@/source/shared/ui/icons";
import avatarStyles from "@/source/features/profile/settings/ui/ProfileAvatarUpload.module.scss";
import formStyles from "@/source/features/profile/settings/ui/PersonalDataForm.module.scss";
import s from "./SettingsSkeleton.module.scss";

interface SettingsSkeletonProps {
  section: "personal" | "finance";
}

export function SettingsSkeleton({ section }: SettingsSkeletonProps) {
  if (section === "finance") {
    return (
      <div className={s.finance} aria-hidden="true">
        <Skeleton className={s.balance} rounded="pill" />
        <div className={s.financeButtons}>
          <Skeleton className={s.financeButton} rounded="lg" />
          <Skeleton className={s.financeButton} rounded="lg" />
        </div>
        <div className={s.financeList}>
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className={s.financeItem}>
              <Skeleton className={s.financeLineWide} />
              <Skeleton className={s.financeLineShort} rounded="pill" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={s.form} aria-hidden="true">
      <div className={s.avatarSection}>
        <div className={avatarStyles.heading}>
          <h2 className={avatarStyles.title}>Фото профиля</h2>
        </div>
        <div className={avatarStyles.content}>
          <div className={s.avatarTriggerWrap}>
            <Skeleton className={s.avatarCircle} rounded="pill" />
          </div>
          <span className={avatarStyles.hint}>JPG, PNG до 5 МБ</span>
        </div>
      </div>

      <div className={formStyles.section}>
        <h2 className={formStyles.subtitle}>Персональные данные</h2>
        <div className={formStyles.grid}>
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className={s.input} rounded="lg" />
          ))}
        </div>
      </div>

      <div className={formStyles.section}>
        <h2 className={formStyles.subtitle}>Изменить пароль</h2>
        <div className={formStyles.grid}>
          {Array.from({ length: 2 }, (_, index) => (
            <Skeleton key={index} className={s.input} rounded="lg" />
          ))}
        </div>
      </div>

      <div className={formStyles.saveWrapper}>
        <Button variant="chat" size="md" className={formStyles.saveButton} disabled>
          Сохранить изменения
        </Button>
        <Button variant="transparent" size="md" className={formStyles.logoutButton} disabled>
          <span className={formStyles.logoutContent}>
            <LogoutIcon className={formStyles.logoutIcon} />
            <span>Выйти из профиля</span>
          </span>
        </Button>
      </div>
    </div>
  );
}