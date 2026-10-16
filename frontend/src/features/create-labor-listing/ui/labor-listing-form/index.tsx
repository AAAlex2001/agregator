"use client";

import type { LaborListingKind } from "@/entities/labor";
import { Button } from "@/shared/ui/button";
import { useLaborListingForm } from "../../model/use-labor-listing-form";
import { EmploymentFields } from "../employment-fields";
import { ExpertCertificateFields } from "../expert-certificate-fields";
import { LicenseRequirementFields } from "../license-requirement-fields";
import { ProfileCertificates } from "../profile-certificates";
import { TermFields } from "../term-fields";
import styles from "./style.module.scss";

/** Вид публикуемого объявления, заголовок формы и действие после публикации. */
interface LaborListingFormProps {
  kind: LaborListingKind;
  title: string;
  onCreated: () => void;
}

/** Собирает требования и условия трудоустройства и публикует объявление. */
export function LaborListingForm({ kind, title, onCreated }: LaborListingFormProps) {
  const form = useLaborListingForm(kind, onCreated);
  const isExpert = kind === "EXPERT_AVAILABLE";
  const showsProfile = form.profile.isLoading
    || form.profile.hasError
    || form.profile.certificates.length > 0;

  return (
    <form
      className={styles.form}
      onSubmit={form.submit}
    >
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.grid}>
        <div className={styles.column}>
          {showsProfile && (
            <ProfileCertificates
              certificates={form.profile.certificates}
              isLoading={form.profile.isLoading}
              hasError={form.profile.hasError}
            />
          )}

          {isExpert && !showsProfile && <ExpertCertificateFields form={form} />}

          {!isExpert && <LicenseRequirementFields form={form} />}
        </div>

        <div className={styles.column}>
          <TermFields form={form} />
        </div>

        <div className={styles.column}>
          <EmploymentFields
            isExpert={isExpert}
            form={form}
          />
        </div>
      </div>

      <div className={styles.footer}>
        <Button
          type="submit"
          variant="primary"
          size="md"
          fullWidth
          isLoading={form.state.isSubmitting}
          disabled={form.profile.isLoading || form.profile.hasError}
        >
          Опубликовать заявку
        </Button>
      </div>
    </form>
  );
}
