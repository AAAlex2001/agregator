"use client";

import { useState } from "react";
import type { ExpertiseType } from "@/entities/expertise";
import type { LicenseRentalKind } from "@/entities/license-holder";
import { useUpdateLicenseTerms } from "@/entities/user";
import type { UserProfile } from "@/entities/user";
import { useNotifications } from "@/shared/ui/notifications";
import { createLicenseTermsFields } from "./license-terms-fields";

/** Редактирует условия лицензии и сохраняет их по кнопке пользователя. */
export function useLicenseTermsForm(profile: UserProfile) {
  const { isSaving, saveTerms } = useUpdateLicenseTerms();
  const { showError, showSuccess } = useNotifications();
  const [fields, setFields] = useState(() => createLicenseTermsFields(profile));

  /** Меняет номер лицензии на экспертизу промышленной безопасности. */
  function changeLicenseNumber(licenseNumber: string) {
    setFields((current) => ({
      ...current,
      licenseNumber,
    }));
  }

  /** Меняет объекты экспертизы, разрешённые лицензией. */
  function changeLicenseAreas(licenseAreas: ExpertiseType[]) {
    setFields((current) => ({
      ...current,
      licenseAreas,
    }));
  }

  /** Выбирает способ расчёта стоимости предоставления лицензии. */
  function changeRentalKind(rentalKind: LicenseRentalKind) {
    setFields((current) => ({
      ...current,
      rentalKind,
    }));
  }

  /** Меняет стоимость предоставления лицензии в процентах. */
  function changeRentalPercent(rentalPercent: string) {
    setFields((current) => ({
      ...current,
      rentalPercent,
    }));
  }

  /** Меняет фиксированную стоимость предоставления лицензии. */
  function changeRentalFixedAmount(rentalFixedAmount: string) {
    setFields((current) => ({
      ...current,
      rentalFixedAmount,
    }));
  }

  /** Меняет номер лицензии на маркшейдерские работы. */
  function changeMiningLicenseNumber(miningLicenseNumber: string) {
    setFields((current) => ({
      ...current,
      miningLicenseNumber,
    }));
  }

  /** Меняет номер свидетельства аккредитации лаборатории. */
  function changeLabAccreditationNumber(labAccreditationNumber: string) {
    setFields((current) => ({
      ...current,
      labAccreditationNumber,
    }));
  }

  /** Сохраняет заполненные условия и сообщает результат пользователю. */
  async function save() {
    if (isSaving) {
      return;
    }

    try {
      await saveTerms({
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
      });
      showSuccess("Условия лицензии сохранены");
    } catch (error) {
      showError(
        error instanceof Error
          ? error.message
          : "Не удалось сохранить условия лицензии",
      );
    }
  }

  return {
    fields,
    isSaving,
    changeLicenseNumber,
    changeLicenseAreas,
    changeRentalKind,
    changeRentalPercent,
    changeRentalFixedAmount,
    changeMiningLicenseNumber,
    changeLabAccreditationNumber,
    save,
  };
}
