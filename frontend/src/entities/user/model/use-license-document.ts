"use client";

import { useState } from "react";
import { deleteCompanyCard } from "../api/delete-company-card";
import { uploadCompanyCard } from "../api/upload-company-card";
import { uploadLabAccreditationFile } from "../api/upload-lab-accreditation-file";
import { uploadLicenseFile } from "../api/upload-license-file";
import { uploadMiningLicenseFile } from "../api/upload-mining-license-file";
import { uploadSroDesignFile } from "../api/upload-sro-design-file";
import { uploadSroSurveyFile } from "../api/upload-sro-survey-file";
import type { LicenseDocumentKind } from "./types";
import { useUser } from "./use-user";

/** Запрос загрузки для каждого документа держателя лицензии. */
const DOCUMENT_UPLOADS = {
  license: uploadLicenseFile,
  companyCard: uploadCompanyCard,
  miningLicense: uploadMiningLicenseFile,
  sroDesign: uploadSroDesignFile,
  sroSurvey: uploadSroSurveyFile,
  labAccreditation: uploadLabAccreditationFile,
};

/** Загружает один документ и применяет обновлённый профиль аккаунта. */
export function useLicenseDocument(kind: LicenseDocumentKind) {
  const { updateUser } = useUser();
  const [isUploading, setIsUploading] = useState(false);

  /** Заменяет выбранный документ файлом с компьютера. */
  async function upload(file: File) {
    setIsUploading(true);

    try {
      const user = await DOCUMENT_UPLOADS[kind](file);

      updateUser(user);
    } finally {
      setIsUploading(false);
    }
  }

  /** Удаляет карточку предприятия из профиля держателя лицензии. */
  async function removeCompanyCard() {
    setIsUploading(true);

    try {
      const user = await deleteCompanyCard();

      updateUser(user);
    } finally {
      setIsUploading(false);
    }
  }

  return {
    isUploading,
    upload,
    removeCompanyCard,
  };
}
