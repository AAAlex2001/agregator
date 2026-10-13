"use client";

import { emptyAuditLicenseHolderProfile } from "@/source/entities/directions/audit";
import { DesignHolderProfileFields } from "@/source/entities/directions/design";
import { emptySroHolderProfile, LocalFilePicker } from "@/source/entities/directions/shared";
import { SurveyHolderProfileFields } from "@/source/entities/directions/survey";
import { emptyTechDiagHolderProfile } from "@/source/entities/directions/tech-diag";
import { TypesPicker } from "@/source/entities/expertise";
import { ORDER_WORK_OPTIONS } from "@/source/entities/order";
import { PartySuggestInput } from "@/source/entities/party";
import { RentalPriceField } from "@/source/shared/ui";
import { TextInput } from "@/source/shared/ui/Inputs";
import { DirectionList } from "./directions/DirectionList";
import { DirectionOption } from "./directions/DirectionOption";
import { RegulatoryDocumentsBlock } from "./RegulatoryDocumentsBlock";
import type { StepProps } from "./types";

const LICENSE_ACCEPT = ".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png";
const LICENSE_HINT = "PDF / JPG / PNG, до 5 МБ";
const WITH_PROFILE = ["EXPERTISE", "AUDIT_SUPB", "TECH_DIAG", "DESIGN", "ECOLOGY", "SURVEY"];
const MARK_OPTIONS = ORDER_WORK_OPTIONS.filter((option) => !WITH_PROFILE.includes(option.value));

/** Поля держателя документов: лицензия ЭПБ с условиями, анкеты СРО и лабораторий, остальные направления галочками. */
export function HolderFields({ state, dispatch }: StepProps) {
  const audit = state.auditHolderProfile;
  const techDiag = state.techDiagHolderProfile;
  const design = state.designHolderProfile;
  const survey = state.surveyHolderProfile;

  return (
    <>
      <DirectionList>
        <DirectionOption
          id="EPB_LICENSE"
          title="Лицензия на проведение экспертизы промышленной безопасности"
          description="Области действия лицензии, условия предоставления и файлы разрешительных документов"
          checked={state.licenseEnabled}
          onToggle={() => dispatch({ type: "licenseEnabled", value: !state.licenseEnabled })}
        >
          <TextInput
            id="register-license-number"
            value={state.licenseNumber}
            autoComplete="off"
            onChange={(event) => dispatch({ type: "set", key: "licenseNumber", value: event.target.value })}
            placeholder="Номер лицензии ЭПБ ОПО"
          />
          <LocalFilePicker
            label="Файл лицензии"
            hint={LICENSE_HINT}
            accept={LICENSE_ACCEPT}
            file={state.files.license}
            onSelect={(file) => dispatch({ type: "file", key: "license", file })}
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
          onToggle={() => dispatch({ type: "auditHolder", value: audit ? null : emptyAuditLicenseHolderProfile })}
          note="Области аккредитации по аудиту СУПБ укажете в личном кабинете."
        >
          {audit && (
            <TextInput
              id="register-audit-certificate"
              value={audit.certificate_number}
              onChange={(event) =>
                dispatch({ type: "auditHolder", value: { ...audit, certificate_number: event.target.value } })
              }
              placeholder="№ свидетельства об аккредитации"
            />
          )}
        </DirectionOption>

        <DirectionOption
          id="TECH_DIAG"
          title="Лаборатория неразрушающего контроля"
          description="Техническое освидетельствование и диагностирование: аккредитация лаборатории и виды контроля"
          checked={techDiag !== null}
          onToggle={() =>
            dispatch({ type: "techDiagHolder", value: techDiag ? null : emptyTechDiagHolderProfile })
          }
          note="Виды неразрушающего контроля укажете в личном кабинете. Лицензию и аккредитацию лаборатории приложите в блоке лицензии выше."
        >
          {techDiag && (
            <TextInput
              id="register-techdiag-city"
              value={techDiag.organization_city}
              onChange={(event) =>
                dispatch({ type: "techDiagHolder", value: { ...techDiag, organization_city: event.target.value } })
              }
              placeholder="Где находится организация — город"
            />
          )}
        </DirectionOption>

        <DirectionOption
          id="DESIGN"
          title="Проектирование промышленных и гражданских объектов"
          description="Членство в СРО проектировщиков: права, компенсационный фонд и условия предоставления"
          checked={design !== null}
          onToggle={() => dispatch({ type: "designHolder", value: design ? null : emptySroHolderProfile })}
          note="Выписку из реестра членов СРО приложите в блоке разрешительных документов выше, дополнительные документы можно загрузить в личном кабинете."
        >
          {design && (
            <DesignHolderProfileFields value={design} onChange={(value) => dispatch({ type: "designHolder", value })} />
          )}
        </DirectionOption>

        <DirectionOption
          id="SURVEY"
          title="Инженерные изыскания"
          description="Членство в СРО изыскателей: права, компенсационный фонд и условия предоставления"
          checked={survey !== null}
          onToggle={() => dispatch({ type: "surveyHolder", value: survey ? null : emptySroHolderProfile })}
          note="Выписку из реестра членов СРО приложите в блоке разрешительных документов выше, дополнительные документы можно загрузить в личном кабинете."
        >
          {survey && (
            <SurveyHolderProfileFields value={survey} onChange={(value) => dispatch({ type: "surveyHolder", value })} />
          )}
        </DirectionOption>

        {MARK_OPTIONS.map((option) => (
          <DirectionOption
            key={option.value}
            id={option.value}
            title={option.label}
            description={option.description}
            checked={state.directions.includes(option.value)}
            onToggle={() =>
              dispatch({ type: "direction", key: option.value, value: !state.directions.includes(option.value) })
            }
          />
        ))}
      </DirectionList>

      <PartySuggestInput
        value={state.companyName}
        onChange={(query, picked) =>
          picked ? dispatch({ type: "party", party: picked }) : dispatch({ type: "companyText", value: query })
        }
        placeholder="ИНН или название организации"
      />
    </>
  );
}
