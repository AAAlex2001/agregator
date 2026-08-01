import Button from "@/source/shared/ui/Button";
import Skeleton from "@/source/shared/ui/Skeleton";
import { FormGrid, FormSection } from "@/source/shared/ui";
import { LogoutIcon } from "@/source/shared/ui/icons";
import s from "./SettingsSkeleton.module.scss";

type SettingsSection = "personal" | "notifications" | "subscription" | "license";

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
  if (section === "license") {
    return <LicenseSkeleton />;
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

function LicenseSkeleton() {
  return (
    <div className={s.license} aria-hidden="true">
      <div className={s.licenseHeader}>
        <Skeleton className={s.licenseTitle} rounded="pill" />
        <Skeleton className={s.licenseSubtitle} rounded="pill" />
      </div>
      <Skeleton className={s.input} rounded="lg" />
      <div className={s.licenseFile}>
        <Skeleton className={s.licenseLabel} rounded="pill" />
        <Skeleton className={s.licenseFileTile} rounded="md" />
      </div>
      <div className={s.licenseField}>
        <Skeleton className={s.licenseLabel} rounded="pill" />
        <div className={s.licenseBadges}>
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className={s.licenseBadge} rounded="md" />
          ))}
        </div>
      </div>
      <div className={s.licenseField}>
        <Skeleton className={s.licenseLabel} rounded="pill" />
        <Skeleton className={s.licenseRadio} rounded="lg" />
        <Skeleton className={s.licenseRadio} rounded="lg" />
        <Skeleton className={s.licenseRadio} rounded="lg" />
      </div>
      <Skeleton className={s.licenseSave} rounded="lg" />
    </div>
  );
}

function PersonalSkeleton({ isCustomer }: { isCustomer: boolean }) {
  return (
    <div className={s.form} aria-hidden="true">
      <div className={s.avatarSection}>
        <h2 className={s.avatarTitle}>Фото профиля</h2>
        <div className={s.avatarContent}>
          <div className={s.avatarTriggerWrap}>
            <Skeleton className={s.avatarCircle} rounded="pill" />
          </div>
          <span className={s.avatarHint}>JPG, PNG до 5 МБ</span>
        </div>
      </div>

      <FormSection title="Персональные данные">
        <FormGrid>
          <Skeleton className={s.input} rounded="lg" />
          <Skeleton className={s.input} rounded="lg" />
          <Skeleton className={s.input} rounded="lg" />
          <div className={s.emailCell}>
            <Skeleton className={s.input} rounded="lg" />
            <Skeleton className={s.verifiedBadge} rounded="pill" />
          </div>
        </FormGrid>

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
      </FormSection>

      <FormSection title="Изменить пароль">
        <FormGrid>
          {Array.from({ length: 2 }, (_, index) => (
            <Skeleton key={index} className={s.input} rounded="lg" />
          ))}
        </FormGrid>
      </FormSection>

      <div className={s.saveWrapper}>
        <Button variant="chat" size="md" className={s.saveButton} disabled>
          Сохранить изменения
        </Button>
        <Button variant="transparent" size="md" className={s.logoutButton} disabled>
          <span className={s.logoutContent}>
            <LogoutIcon className={s.logoutIcon} />
            <span>Выйти из профиля</span>
          </span>
        </Button>
      </div>
    </div>
  );
}
