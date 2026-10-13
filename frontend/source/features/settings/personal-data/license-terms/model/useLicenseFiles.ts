"use client";

import { useState } from "react";
import {
  deleteCompanyCard,
  uploadCompanyCard,
  uploadLabAccreditationFile,
  uploadLicenseFile,
  uploadMiningLicenseFile,
  uploadSroDesignFile,
  uploadSroSurveyFile,
} from "@/source/entities/user";
import { useSession } from "@/source/entities/session";
import { useNotifications } from "@/source/shared/ui/Notifications";

type LicenseFileKind = "license" | "companyCard" | "miningLicense" | "sroDesign" | "sroSurvey" | "labAccreditation";

const UPLOADS = {
  license: { send: uploadLicenseFile, success: "Файл лицензии обновлён" },
  companyCard: { send: uploadCompanyCard, success: "Карточка предприятия обновлена" },
  miningLicense: { send: uploadMiningLicenseFile, success: "Файл лицензии маркшейдера обновлён" },
  sroDesign: { send: uploadSroDesignFile, success: "Выписка из реестра СРО проектировщиков обновлена" },
  sroSurvey: { send: uploadSroSurveyFile, success: "Выписка из реестра СРО изыскателей обновлена" },
  labAccreditation: { send: uploadLabAccreditationFile, success: "Файл аккредитации лаборатории обновлён" },
};

/** Файлы держателя документов: загружаются и удаляются сразу, без кнопки «Сохранить». */
export function useLicenseFiles() {
  const { setUser } = useSession();
  const { showError, showSuccess } = useNotifications();
  const [uploading, setUploading] = useState<LicenseFileKind | null>(null);

  const upload = async (kind: LicenseFileKind, file: File) => {
    setUploading(kind);
    try {
      setUser(await UPLOADS[kind].send(file));
      showSuccess(UPLOADS[kind].success);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось загрузить файл");
    } finally {
      setUploading(null);
    }
  };

  const removeCompanyCard = async () => {
    setUploading("companyCard");
    try {
      setUser(await deleteCompanyCard());
      showSuccess("Карточка предприятия удалена");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось удалить файл");
    } finally {
      setUploading(null);
    }
  };

  return { uploading, upload, removeCompanyCard };
}
