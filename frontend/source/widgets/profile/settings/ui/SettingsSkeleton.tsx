import Button from "@/source/shared/ui/Button";
import Skeleton from "@/source/shared/ui/Skeleton";
import { LogoutIcon } from "@/source/shared/ui/icons";
import avatarStyles from "@/source/entities/user/ui/ProfileAvatarUpload.module.scss";
import formStyles from "@/source/entities/user/ui/ProfileForm.module.scss";
import s from "./SettingsSkeleton.module.scss";

type SettingsSection = "personal" | "notifications" | "subscription";

interface SettingsSkeletonProps {
  section: SettingsSection;
  isCustomer?: boolean;
}

export function SettingsSkeleton({ section, isCustomer = false }: SettingsSkeletonProps) {
  if (section === "subscription") {
    return <SubscriptionSkeleton />;
  }
  if (section === "notifications") {
    return <NotificationsSkeleton />;
  }
  return <PersonalSkeleton isCustomer={isCustomer} />;
}

function SubscriptionSkeleton() {
  return (
    <div className={s.finance} aria-hidden="true">
      <Skeleton className={s.balance} rounded="pill" />
      <div className={s.financeList}>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className={s.financeItem}>
            <Skeleton className={s.financeLineWide} />
            <Skeleton className={s.financeLineShort} rounded="pill" />
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationsSkeleton() {
  return (
    <div className={s.notifications} aria-hidden="true">
      <div className={s.notificationsHeader}>
        <Skeleton className={s.notificationsTitle} rounded="pill" />
        <Skeleton className={s.notificationsSubtitle} rounded="pill" />
      </div>
      <div className={s.notificationsList}>
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className={s.notificationsItem}>
            <div className={s.notificationsText}>
              <Skeleton className={s.notificationsLabel} rounded="pill" />
              <Skeleton className={s.notificationsDescription} rounded="pill" />
            </div>
            <Skeleton className={s.switchTrack} rounded="pill" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PersonalSkeleton({ isCustomer }: { isCustomer: boolean }) {
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
          <Skeleton className={s.input} rounded="lg" />
          <Skeleton className={s.input} rounded="lg" />
          <Skeleton className={s.input} rounded="lg" />
          <div className={s.emailCell}>
            <Skeleton className={s.input} rounded="lg" />
            <Skeleton className={s.verifiedBadge} rounded="pill" />
          </div>
        </div>

        {isCustomer && (
          <div className={s.companyBlock}>
            <div className={s.emailCell}>
              <Skeleton className={s.input} rounded="lg" />
              <Skeleton className={s.verifiedBadge} rounded="pill" />
            </div>
            <div className={s.emailCell}>
              <Skeleton className={s.input} rounded="lg" />
              <Skeleton className={s.verifiedBadge} rounded="pill" />
            </div>
            <Skeleton className={s.companyHint} rounded="pill" />
          </div>
        )}
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
