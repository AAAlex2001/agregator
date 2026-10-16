"use client";

import {
  CadastralProfileFields,
  useCadastralProfile,
  useUploadCadastralCertificate,
  useUploadCadastralDiploma,
} from "@/entities/cadastral";
import { Button } from "@/shared/ui/button";
import { useCadastralProfileForm } from "../../model/use-cadastral-profile-form";
import { CadastralDocuments } from "../cadastral-documents";
import { CadastralFileField } from "../cadastral-file-field";
import styles from "./style.module.scss";

/** Собирает сведения инженера, его документы и кнопку сохранения анкеты. */
export function CadastralProfileForm() {
  const { fields, change, save } = useCadastralProfileForm();
  const { profile, operation } = useCadastralProfile();
  const uploadDiploma = useUploadCadastralDiploma();
  const uploadCertificate = useUploadCadastralCertificate();
  const isBusy = operation !== "idle";

  return (
    <div className={styles.card}>
      <fieldset
        className={styles.fields}
        disabled={isBusy}
      >
        <CadastralProfileFields
          value={fields}
          onChange={change}
        />
        <CadastralFileField
          label="Диплом об образовании"
          file={profile.education_diploma}
          isBusy={isBusy}
          onUpload={uploadDiploma}
        />
        <CadastralFileField
          label="Квалификационный аттестат"
          file={profile.certificate_file}
          isBusy={isBusy}
          onUpload={uploadCertificate}
        />
        <CadastralDocuments />
      </fieldset>

      <Button
        variant="chat"
        size="md"
        fullWidth
        isLoading={operation === "saving"}
        disabled={isBusy}
        onClick={save}
      >
        Сохранить анкету
      </Button>
    </div>
  );
}
