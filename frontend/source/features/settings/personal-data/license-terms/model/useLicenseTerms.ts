"use client";

import { useState } from "react";
import { TYPES, type ExpertiseType } from "@/source/entities/expertise";
import { updateLicenseHolderProfile, type UserProfile } from "@/source/entities/user";
import type { LicenseRentalKind } from "@/source/shared/ui/RentalPriceField";
import { useSession } from "@/source/entities/session";
import { useNotifications } from "@/source/shared/ui/Notifications";

interface LicenseTermsFields {
  licenseNumber: string;
  licenseAreas: ExpertiseType[];
  rentalKind: LicenseRentalKind;
  rentalPercent: string;
  rentalFixedAmount: string;
  miningLicenseNumber: string;
  labAccreditationNumber: string;
}

const toFields = (profile: UserProfile): LicenseTermsFields => {
  const holder = profile.license_holder;

  return {
    licenseNumber: holder?.license_number ?? "",
    licenseAreas: TYPES.filter((type) => holder?.license_areas?.includes(type)),
    rentalKind: holder?.license_rental_kind ?? "PERCENT",
    rentalPercent: holder?.license_rental_kind === "PERCENT" ? String(holder.license_rental_percent ?? "") : "",
    rentalFixedAmount: holder?.license_rental_kind === "FIXED" ? String(holder.license_rental_fixed_amount ?? "") : "",
    miningLicenseNumber: holder?.mining_license_number ?? "",
    labAccreditationNumber: holder?.lab_accreditation_number ?? "",
  };
};

/** Номер лицензии, объекты экспертизы, стоимость предоставления и номера дополнительных документов. */
export function useLicenseTerms(profile: UserProfile) {
  const { setUser } = useSession();
  const { showError, showSuccess } = useNotifications();
  const [fields, setFields] = useState(() => toFields(profile));
  const [isSaving, setIsSaving] = useState(false);

  const save = async () => {
    setIsSaving(true);
    try {
      setUser(
        await updateLicenseHolderProfile({
          license_number: fields.licenseNumber.trim(),
          license_areas: fields.licenseAreas,
          license_rental_kind: fields.rentalKind,
          license_rental_percent:
            fields.rentalKind === "PERCENT" && fields.rentalPercent.trim()
              ? Number(fields.rentalPercent.replace(",", "."))
              : undefined,
          license_rental_fixed_amount:
            fields.rentalKind === "FIXED" && fields.rentalFixedAmount.trim()
              ? Number(fields.rentalFixedAmount.replace(/\s/g, ""))
              : undefined,
          mining_license_number: fields.miningLicenseNumber.trim() || null,
          lab_accreditation_number: fields.labAccreditationNumber.trim() || null,
        }),
      );
      showSuccess("Условия лицензии сохранены");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить условия лицензии");
    } finally {
      setIsSaving(false);
    }
  };

  return { fields, isSaving, change: setFields, save };
}
