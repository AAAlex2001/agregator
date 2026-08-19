"use client";

import { useRef, useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { TYPES, type ExpertiseType } from "@/source/entities/expertise";
import {
  useRegisterProfileSave,
  type LicenseHolderUpdatePayload,
  type LicenseRentalKind,
  type UserProfile,
} from "@/source/entities/user";
import {
  deleteCompanyCard,
  updateLicenseHolderProfile,
  uploadCompanyCard,
  uploadLabAccreditationFile,
  uploadLicenseFile,
  uploadMiningLicenseFile,
  uploadSroDesignFile,
  uploadSroSurveyFile,
} from "@/source/entities/user";

interface Options {
  profile: UserProfile;
  onProfileUpdate: (profile: UserProfile) => void;
}

export function useLicenseTerms({ profile, onProfileUpdate }: Options) {
  const { showError, showSuccess } = useNotifications();
  const holder = profile.license_holder;

  const [licenseNumber, setLicenseNumber] = useState(holder?.license_number ?? "");
  const [licenseAreas, setLicenseAreas] = useState<ExpertiseType[]>(
    (holder?.license_areas ?? []).filter((area): area is ExpertiseType =>
      TYPES.includes(area as ExpertiseType),
    ),
  );
  const [rentalKind, setRentalKind] = useState<LicenseRentalKind>(
    holder?.license_rental_kind ?? "PERCENT",
  );
  const [rentalPercent, setRentalPercent] = useState(
    holder?.license_rental_kind === "PERCENT" && holder.license_rental_percent !== null
      ? String(holder.license_rental_percent)
      : "",
  );
  const [rentalFixedAmount, setRentalFixedAmount] = useState(
    holder?.license_rental_kind === "FIXED" && holder.license_rental_fixed_amount !== null
      ? String(holder.license_rental_fixed_amount)
      : "",
  );
  const [miningLicenseNumber, setMiningLicenseNumber] = useState(holder?.mining_license_number ?? "");
  const [labAccreditationNumber, setLabAccreditationNumber] = useState(
    holder?.lab_accreditation_number ?? "",
  );

  const [isUploading, setIsUploading] = useState(false);
  const [isCardUploading, setIsCardUploading] = useState(false);
  const [isMiningUploading, setIsMiningUploading] = useState(false);
  const [isSroUploading, setIsSroUploading] = useState(false);
  const [isSroSurveyUploading, setIsSroSurveyUploading] = useState(false);
  const [isLabUploading, setIsLabUploading] = useState(false);

  const payload = (): LicenseHolderUpdatePayload => ({
    license_number: licenseNumber.trim(),
    license_areas: licenseAreas,
    license_rental_kind: rentalKind,
    license_rental_percent:
      rentalKind === "PERCENT" && rentalPercent.trim()
        ? Number(rentalPercent.replace(",", "."))
        : undefined,
    license_rental_fixed_amount:
      rentalKind === "FIXED" && rentalFixedAmount.trim()
        ? Number(rentalFixedAmount.replace(/\s/g, ""))
        : undefined,
    mining_license_number: miningLicenseNumber.trim() || null,
    lab_accreditation_number: labAccreditationNumber.trim() || null,
  });

  const savedPayloadRef = useRef(JSON.stringify(payload()));

  useRegisterProfileSave(async () => {
    const nextPayload = payload();
    const serializedPayload = JSON.stringify(nextPayload);
    if (serializedPayload === savedPayloadRef.current) return;

    const updated = await updateLicenseHolderProfile(nextPayload);
    savedPayloadRef.current = serializedPayload;
    onProfileUpdate(updated);
  });

  const makeUploader = (
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

  return {
    licenseNumber,
    setLicenseNumber,
    licenseAreas,
    setLicenseAreas,
    rentalKind,
    setRentalKind,
    rentalPercent,
    setRentalPercent,
    rentalFixedAmount,
    setRentalFixedAmount,
    miningLicenseNumber,
    setMiningLicenseNumber,
    labAccreditationNumber,
    setLabAccreditationNumber,
    isUploading,
    isCardUploading,
    isMiningUploading,
    isSroUploading,
    isSroSurveyUploading,
    isLabUploading,
    replaceFile: makeUploader(uploadLicenseFile, setIsUploading, "Файл лицензии обновлён"),
    replaceCompanyCard: makeUploader(uploadCompanyCard, setIsCardUploading, "Карточка предприятия обновлена"),
    removeCompanyCardFile,
    replaceMiningLicenseFile: makeUploader(
      uploadMiningLicenseFile,
      setIsMiningUploading,
      "Файл лицензии маркшейдера обновлён",
    ),
    replaceSroDesignFile: makeUploader(
      uploadSroDesignFile,
      setIsSroUploading,
      "Выписка из реестра членов СРО обновлена",
    ),
    replaceSroSurveyFile: makeUploader(
      uploadSroSurveyFile,
      setIsSroSurveyUploading,
      "Выписка из реестра членов СРО обновлена",
    ),
    replaceLabAccreditationFile: makeUploader(
      uploadLabAccreditationFile,
      setIsLabUploading,
      "Файл аккредитации лаборатории обновлён",
    ),
  };
}
