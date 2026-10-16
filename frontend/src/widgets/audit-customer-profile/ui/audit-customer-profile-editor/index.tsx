"use client";

import { useLoadAuditCustomerProfile } from "@/entities/audit";
import { AuditCustomerProfileForm } from "@/features/edit-audit-customer-profile";
import { Skeleton } from "@/shared/ui/skeleton";
import styles from "./style.module.scss";

/** Загружает анкету заказчика аудита и открывает её редактирование. */
export function AuditCustomerProfileEditor() {
  const { profile, error } = useLoadAuditCustomerProfile();

  if (error) {
    return (
      <p
        className={styles.error}
        role="alert"
      >
        {error}
      </p>
    );
  }

  if (!profile) {
    return <Skeleton className={styles.skeleton} />;
  }

  return <AuditCustomerProfileForm initialProfile={profile} />;
}
