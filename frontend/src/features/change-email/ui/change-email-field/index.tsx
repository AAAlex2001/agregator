"use client";

import type { UserProfile } from "@/entities/user";
import { EmailInput } from "@/shared/ui/email-input";
import { VerifiedBadge } from "@/shared/ui/verified-badge";
import { useChangeEmailForm } from "../../model/use-change-email-form";
import { ChangeEmailDialog } from "../change-email-dialog";
import styles from "./style.module.scss";

/** Текущая почта и отметка её подтверждения в профиле. */
interface ChangeEmailFieldProps {
  profile: UserProfile;
}

/** Показывает почту профиля и открывает окно её смены. */
export function ChangeEmailField({ profile }: ChangeEmailFieldProps) {
  const form = useChangeEmailForm();

  return (
    <div className={styles.field}>
      <EmailInput
        id="profile-email"
        aria-label="Email"
        value={profile.email ?? ""}
        disabled
      />

      <div className={styles.meta}>
        {profile.email_verified && (
          <VerifiedBadge>Почта подтверждена</VerifiedBadge>
        )}
        <button
          type="button"
          className={styles.change}
          onClick={form.open}
        >
          Изменить почту
        </button>
      </div>

      <ChangeEmailDialog
        form={form}
        currentEmail={profile.email}
      />
    </div>
  );
}
