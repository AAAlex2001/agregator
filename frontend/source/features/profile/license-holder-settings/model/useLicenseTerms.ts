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
import {
  deleteCompanyCard,
  updateLicenseHolderProfile,
  uploadCompanyCard,
  uploadLabAccreditationFile,
  uploadLicenseFile,
  uploadMiningLicenseFile,
  uploadSroDesignFile,
} from "@/source/entities/user";
import { licenseTermsSchema, type LicenseTermsValues } from "./schema";

interface Options {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

const isExpertiseType = (v: unknown): v is ExpertiseType =>
  typeof v === "string" && (TYPES as readonly string[]).includes(v);

function profileToValues(profile: UserProfile): LicenseTermsValues {
  const holder = profile.license_holder;
  return {
    licenseNumber: holder?.license_number ?? "",
    licenseAreas: (holder?.license_areas ?? []).filter(isExpertiseType),
    rentalKind: holder?.license_rental_kind ?? "PERCENT",
    rentalPercent:
      holder?.license_rental_kind === "PERCENT" && holder.license_rental_percent !== null
        ? String(holder.license_rental_percent)
        : "",
    rentalFixedAmount:
      holder?.license_rental_kind === "FIXED" && holder.license_rental_fixed_amount !== null
        ? String(holder.license_rental_fixed_amount)
        : "",
    miningLicenseNumber: holder?.mining_license_number ?? "",
    labAccreditationNumber: holder?.lab_accreditation_number ?? "",
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
    mining_license_number: values.miningLicenseNumber.trim() || null,
    lab_accreditation_number: values.labAccreditationNumber.trim() || null,
  };
}

export function useLicenseTerms({ profile, onProfileUpdate }: Options) {
  const { showError, showSuccess } = useNotifications();
  const [isUploading, setIsUploading] = useState(false);
  const [isCardUploading, setIsCardUploading] = useState(false);
  const [isMiningUploading, setIsMiningUploading] = useState(false);
  const [isSroUploading, setIsSroUploading] = useState(false);
  const [isLabUploading, setIsLabUploading] = useState(false);

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

  const replaceCompanyCard = async (file: File | null) => {
    if (!file) return;
    setIsCardUploading(true);
    try {
      const updated = await uploadCompanyCard(file);
      onProfileUpdate(updated);
      showSuccess("Карточка предприятия обновлена");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Не удалось загрузить файл");
    } finally {
      setIsCardUploading(false);
    }
  };

  const removeCompanyCardFile = async () => {
    setIsCardUploading(true);
    try {
      const updated = await deleteCompanyCard();
      onProfileUpdate(updated);
      showSuccess("Карточка предприятия удалена");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Не удалось удалить файл");
    } finally {
      setIsCardUploading(false);
    }
  };

  const makeRegulatoryUploader = (
    uploader: (file: File) => Promise<UserProfile>,
    setBusy: (v: boolean) => void,
    successMessage: string,
  ) => async (file: File | null) => {
    if (!file) return;
    setBusy(true);
    try {
      const updated = await uploader(file);
      onProfileUpdate(updated);
      showSuccess(successMessage);
    } catch (err) {
      showError(err instanceof Error ? err.message : "Не удалось загрузить файл");
    } finally {
      setBusy(false);
    }
  };

  const replaceMiningLicenseFile = makeRegulatoryUploader(
    uploadMiningLicenseFile,
    setIsMiningUploading,
    "Файл лицензии маркшейдера обновлён",
  );
  const replaceSroDesignFile = makeRegulatoryUploader(
    uploadSroDesignFile,
    setIsSroUploading,
    "Выписка из реестра членов СРО обновлена",
  );
  const replaceLabAccreditationFile = makeRegulatoryUploader(
    uploadLabAccreditationFile,
    setIsLabUploading,
    "Файл аккредитации лаборатории обновлён",
  );

  return {
    form,
    isSaving: form.formState.isSubmitting,
    isUploading,
    isCardUploading,
    isMiningUploading,
    isSroUploading,
    isLabUploading,
    submit,
    replaceFile,
    replaceCompanyCard,
    removeCompanyCardFile,
    replaceMiningLicenseFile,
    replaceSroDesignFile,
    replaceLabAccreditationFile,
  };
}
