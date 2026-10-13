import Skeleton from "@/source/shared/ui/Skeleton";
import { FormGrid, FormSection } from "@/source/shared/ui";
import type { SettingsSection } from "../lib/sections";
import s from "./SettingsSkeleton.module.scss";

interface SettingsSkeletonProps {
  section: SettingsSection;
  isCustomer?: boolean;
}

/** Заглушка вкладки настроек, пока грузится профиль. */
export function SettingsSkeleton({ section, isCustomer = false }: SettingsSkeletonProps) {
  if (section === "notifications") {
    return <NotificationsSkeleton />;
  }
  return <PersonalSkeleton isCustomer={isCustomer} />;
}

function NotificationsSkeleton() {
  return (
    <div className={s.notifications} aria-hidden="true">
      <div className={s.notificationsHeader}>
        <Skeleton className={s.notificationsTitle} rounded="pill" />
        <Skeleton className={s.notificationsSubtitle} rounded="pill" />
      </div>
      <div className={s.notificationsList}>
        {[1, 2, 3, 4].map((key) => (
          <div key={key} className={s.notificationsItem}>
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
        <Skeleton className={s.avatarCircle} rounded="pill" />
        <div className={s.avatarContent}>
          <Skeleton className={s.avatarButton} rounded="md" />
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
          <Skeleton className={s.input} rounded="lg" />
          <Skeleton className={s.input} rounded="lg" />
        </FormGrid>
      </FormSection>
    </div>
  );
}
