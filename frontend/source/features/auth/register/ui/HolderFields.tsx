"use client";

import { useRef } from "react";
import { TextInput } from "@/source/shared/ui/Inputs";
import { FileGallery, RentalPriceField } from "@/source/shared/ui";
import { isImageFileName } from "@/source/shared/lib/filePreview";
import { useObjectUrl } from "@/source/shared/lib/useObjectUrl";
import { TypesPicker } from "@/source/entities/expertise";
import { PartySuggestInput, type PartySuggestion } from "@/source/features/party-suggest";
import { emptyAuditLicenseHolderProfile } from "@/source/features/directions/audit";
import { DirectionOption } from "./directions/DirectionOption";
import { RegulatoryDocumentsBlock } from "./RegulatoryDocumentsBlock";
import type { StepProps } from "./types";
import d from "./directions/DirectionsPicker.module.scss";

const LICENSE_FILE_ACCEPT = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";

export function HolderFields({ state, dispatch }: StepProps) {
  const audit = state.auditHolderProfile;
  const licenseFileInputRef = useRef<HTMLInputElement>(null);
  const licenseBlobUrl = useObjectUrl(state.files.license);

  return (
    <>
      <ul className={d.list}>
        <DirectionOption
          id="EPB_LICENSE"
          title="Лицензия на проведение экспертизы промышленной безопасности"
          description="Области действия лицензии, условия предоставления и файлы разрешительных документов"
          checked={state.licenseEnabled}
          onToggle={() => dispatch({ type: "licenseEnabled", value: !state.licenseEnabled })}
        >
          <TextInput
            id="licenseNumber"
            value={state.licenseNumber}
            autoComplete="off"
            onChange={(e) => dispatch({ type: "set", key: "licenseNumber", value: e.target.value })}
            placeholder="Номер лицензии ЭПБ ОПО"
          />

          <FileGallery
            label="Файл лицензии"
            hint="PDF / JPG / PNG, до 5 МБ"
            items={
              state.files.license && licenseBlobUrl
                ? [
                    {
                      id: "license-local",
                      name: state.files.license.name,
                      url: licenseBlobUrl,
                      previewUrl: licenseBlobUrl,
                      thumbnailUrl: licenseBlobUrl,
                      isImage: isImageFileName(state.files.license.name),
                      onRemove: () => dispatch({ type: "file", key: "license", file: null }),
                    },
                  ]
                : []
            }
            variant="editable"
            onAdd={() => licenseFileInputRef.current?.click()}
            input={
              <input
                ref={licenseFileInputRef}
                type="file"
                accept={LICENSE_FILE_ACCEPT}
                hidden
                onChange={(e) => {
                  dispatch({ type: "file", key: "license", file: e.target.files?.[0] ?? null });
                  e.target.value = "";
                }}
              />
            }
          />

          <TypesPicker
            value={state.licenseAreas}
            onChange={(value) => dispatch({ type: "areas", value })}
            label="Объекты экспертизы по лицензии"
            hint="Выберите все типы, по которым работает ваша лицензия — можно несколько"
          />

          <RentalPriceField
            kind={state.rentalKind}
            percent={state.rentalPercent}
            fixedAmount={state.rentalFixed}
            onChangeKind={(value) => dispatch({ type: "rentalKind", value })}
            onChangePercent={(value) => dispatch({ type: "set", key: "rentalPercent", value })}
            onChangeFixed={(value) => dispatch({ type: "set", key: "rentalFixed", value })}
          />

          <RegulatoryDocumentsBlock state={state} dispatch={dispatch} />
        </DirectionOption>

        <DirectionOption
          id="AUDIT_SUPB"
          title="Аудит СУПБ"
          description="Аккредитованный инспекционный орган — независимая третья сторона по аудиту СУПБ"
          checked={audit !== null}
          onToggle={() =>
            dispatch({ type: "auditHolder", value: audit ? null : { ...emptyAuditLicenseHolderProfile } })
          }
        >
          {audit && (
            <>
              <TextInput
                value={audit.certificate_number}
                onChange={(e) =>
                  dispatch({ type: "auditHolder", value: { ...audit, certificate_number: e.target.value } })
                }
                placeholder="№ свидетельства об аккредитации"
              />
              <span className={d.itemText}>
                Области аккредитации по аудиту СУПБ укажете в личном кабинете.
              </span>
            </>
          )}
        </DirectionOption>
      </ul>

      <PartySuggestInput
        value={state.companyName}
        onChange={(query: string, picked: PartySuggestion | null) =>
          picked
            ? dispatch({ type: "party", party: picked })
            : dispatch({ type: "companyText", value: query })
        }
        placeholder="ИНН или название организации"
      />
    </>
  );
}
