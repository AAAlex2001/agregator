"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { TYPES, type ExpertiseType } from "@/source/entities/expertise";
import type {
  LicenseHolderUpdatePayload,
  UserProfile,
} from "@/source/entities/user";
import { updateLicenseHolderProfile, uploadLicenseFile } from "../api/license.api";
import { licenseTermsSchema, type LicenseTermsValues } from "./schema";

interface Options {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

const isExpertiseType = (v: unknown): v is ExpertiseType =>
  typeof v === "string" && (TYPES as readonly string[]).includes(v);

function profileToValues(profile: UserProfile): LicenseTermsValues {
  return {
    licenseNumber: profile.license_number ?? "",
    licenseAreas: (profile.license_areas ?? []).filter(isExpertiseType),
    rentalKind: profile.license_rental_kind ?? "PERCENT",
    rentalPercent:
      profile.license_rental_kind === "PERCENT" && profile.license_rental_percent !== null
        ? String(profile.license_rental_percent)
        : "",
    rentalFixedAmount:
      profile.license_rental_kind === "FIXED" && profile.license_rental_fixed_amount !== null
        ? String(profile.license_rental_fixed_amount)
        : "",
  };
}

function valuesToPayload(values: LicenseTermsValues): LicenseHolderUpdatePayload {
  return {
    license_number: values.licenseNumber.trim(),
    license_areas: values.licenseAreas,
    license_rental_kind: values.rentalKind,
    license_rental_percent:
      values.rentalKind === "PERCENT" ? Number(values.rentalPercent.replace(",", ".")) : undefined,
    license_rental_fixed_amount:
      values.rentalKind === "FIXED" ? Number(values.rentalFixedAmount.replace(/\s/g, "")) : undefined,
  };
}

export function useLicenseTerms({ profile, onProfileUpdate }: Options) {
  const { showError, showSuccess } = useNotifications();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<LicenseTermsValues>({
    resolver: zodResolver(licenseTermsSchema),
    defaultValues: profileToValues(profile),
    mode: "onBlur",
  });

  const submit = form.handleSubmit(
    async (values) => {
      try {
        const updated = await updateLicenseHolderProfile(valuesToPayload(values));
        onProfileUpdate(updated);
        form.reset(profileToValues(updated));
        showSuccess("Изменения сохранены");
      } catch (err) {
        showError(err instanceof Error ? err.message : "Не удалось сохранить");
      }
    },
    (errors) => {
      const first = Object.values(errors)[0];
      if (first && "message" in first && typeof first.message === "string") {
        showError(first.message);
      }
    },
  );

  const replaceFile = async (file: File | null) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const updated = await uploadLicenseFile(file);
      onProfileUpdate(updated);
      showSuccess("Файл лицензии обновлён");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Не удалось загрузить файл");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    form,
    isSaving: form.formState.isSubmitting,
    isUploading,
    submit,
    replaceFile,
  };
}
