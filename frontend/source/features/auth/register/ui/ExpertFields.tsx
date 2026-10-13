"use client";

import { AuditExpertProfileFields, emptyAuditExpertProfile } from "@/source/entities/directions/audit";
import { CadastralProfileFields, emptyCadastralProfile } from "@/source/entities/directions/cadastral";
import { DesignProfileFields, emptyDesignProfile } from "@/source/entities/directions/design";
import { EcologyProfileFields, emptyEcologyProfile } from "@/source/entities/directions/ecology";
import { ExpertiseProfileFields, emptyExpertiseProfile } from "@/source/entities/directions/expertise";
import { ForensicProfileFields, emptyForensicProfile } from "@/source/entities/directions/forensic";
import { LaboratoryProfileFields, emptyLaboratoryProfile } from "@/source/entities/directions/laboratory";
import { ResearchProfileFields, emptyResearchProfile } from "@/source/entities/directions/research";
import { LocalFilePicker, LocalFilesPicker } from "@/source/entities/directions/shared";
import { SurveyProfileFields, emptySurveyProfile } from "@/source/entities/directions/survey";
import { TechDiagProfileFields, emptyTechDiagProfile } from "@/source/entities/directions/tech-diag";
import { ExpertMapVisibilityFields } from "@/source/entities/expert";
import { Checkbox, FormSection } from "@/source/shared/ui";
import { YandexAddressPicker } from "@/source/shared/ui/YandexMap";
import type { DocListKey, RegisterState } from "../model/types";
import { useRegisterCatalogs } from "../model/useRegisterCatalogs";
import { DirectionList } from "./directions/DirectionList";
import { DirectionOption } from "./directions/DirectionOption";
import type { StepProps } from "./types";
import s from "./ExpertFields.module.scss";

const DESIGN_DOCUMENTS: { key: DocListKey; label: string }[] = [
  { key: "designEducationDocuments", label: "Диплом об образовании — до 5 документов" },
  { key: "designNokDocuments", label: "Свидетельства НОК — до 5 документов" },
  { key: "designNrsDocuments", label: "Уведомления о включении в НРС — до 5 документов" },
  { key: "designQualificationDocuments", label: "Повышение квалификации, курсы — до 5 документов" },
  { key: "designRtnDocuments", label: "Протоколы аттестации РТН — до 5 документов" },
];

const SURVEY_DOCUMENTS: { key: DocListKey; label: string }[] = [
  { key: "surveyEducationDocuments", label: "Диплом об образовании — до 5 документов" },
  { key: "surveyNokDocuments", label: "Свидетельства НОК — до 5 документов" },
  { key: "surveyNrsDocuments", label: "Уведомления о включении в НРС — до 5 документов" },
  { key: "surveyQualificationDocuments", label: "Повышение квалификации, курсы — до 5 документов" },
  { key: "surveyRtnDocuments", label: "Протоколы аттестации РТН — до 5 документов" },
];

const PROFILE_DIRECTIONS = [
  { direction: "EXPERTISE", profile: "expertiseProfile" },
  { direction: "AUDIT_SUPB", profile: "auditExpertProfile" },
  { direction: "TECH_DIAG", profile: "techDiagProfile" },
  { direction: "DESIGN", profile: "designProfile" },
  { direction: "ECOLOGY", profile: "ecologyProfile" },
  { direction: "SURVEY", profile: "surveyProfile" },
  { direction: "RESEARCH", profile: "researchProfile" },
  { direction: "LABORATORY", profile: "laboratoryProfile" },
  { direction: "CADASTRAL", profile: "cadastralProfile" },
  { direction: "FORENSIC", profile: "forensicProfile" },
] as const;

/** Направления, по которым исполнитель отметил анкету, — карта показывает только их. */
function activeDirections(state: RegisterState): string[] {
  return PROFILE_DIRECTIONS.filter((item) => state[item.profile] !== null).map((item) => item.direction);
}

/** Поля исполнителя: анкеты по направлениям с документами и местоположение для карты. */
export function ExpertFields({ state, dispatch }: StepProps) {
  const catalogs = useRegisterCatalogs();
  const { directionFiles } = state;

  const documentsPicker = (key: DocListKey, label: string, maxFiles?: number) => (
    <LocalFilesPicker
      key={key}
      label={label}
      files={directionFiles[key]}
      maxFiles={maxFiles}
      onAdd={(files) => dispatch({ type: "docAdd", key, files })}
      onRemove={(file) => dispatch({ type: "docRemove", key, file })}
    />
  );

  return (
    <>
      <DirectionList>
        <DirectionOption
          id="EXPERTISE"
          title="Экспертиза промышленной безопасности"
          description="Удостоверения: область аттестации, объект экспертизы и категория"
          checked={state.expertiseProfile !== null}
          onToggle={() => dispatch({ type: "expertise", value: state.expertiseProfile ? null : emptyExpertiseProfile })}
        >
          {state.expertiseProfile && (
            <ExpertiseProfileFields
              value={state.expertiseProfile}
              onChange={(value) => dispatch({ type: "expertise", value })}
            />
          )}
        </DirectionOption>

        <DirectionOption
          id="AUDIT_SUPB"
          title="Аудит СУПБ"
          description="Аудитор с независимой оценкой квалификации или инспекционный орган типа А"
          checked={state.auditExpertProfile !== null}
          onToggle={() =>
            dispatch({ type: "auditExpert", value: state.auditExpertProfile ? null : emptyAuditExpertProfile })
          }
        >
          {state.auditExpertProfile && (
            <>
              <AuditExpertProfileFields
                value={state.auditExpertProfile}
                onChange={(value) => dispatch({ type: "auditExpert", value })}
                catalogs={catalogs.audit}
              />
              {documentsPicker("auditDocuments", "Дипломы, аттестаты, курсы")}
            </>
          )}
        </DirectionOption>

        <DirectionOption
          id="CADASTRAL"
          title="Кадастровые работы"
          description="Аттестат кадастрового инженера, оборудование и место работы"
          checked={state.cadastralProfile !== null}
          onToggle={() => dispatch({ type: "cadastral", value: state.cadastralProfile ? null : emptyCadastralProfile })}
        >
          {state.cadastralProfile && (
            <>
              <CadastralProfileFields
                value={state.cadastralProfile}
                onChange={(value) => dispatch({ type: "cadastral", value })}
              />
              <LocalFilePicker
                label="Диплом об образовании"
                file={directionFiles.cadastralDiploma}
                onSelect={(file) => dispatch({ type: "docFile", key: "cadastralDiploma", file })}
              />
              <LocalFilePicker
                label="Квалификационный аттестат"
                file={directionFiles.cadastralCertificate}
                onSelect={(file) => dispatch({ type: "docFile", key: "cadastralCertificate", file })}
              />
              {documentsPicker("cadastralDocuments", "Дипломы, аттестаты, курсы")}
            </>
          )}
        </DirectionOption>

        <DirectionOption
          id="FORENSIC"
          title="Судебная экспертиза"
          description="Образование, опыт аналогичных экспертиз и кто выдаёт заключение"
          checked={state.forensicProfile !== null}
          onToggle={() => dispatch({ type: "forensic", value: state.forensicProfile ? null : emptyForensicProfile })}
        >
          {state.forensicProfile && (
            <>
              <ForensicProfileFields
                value={state.forensicProfile}
                onChange={(value) => dispatch({ type: "forensic", value })}
              />
              <LocalFilePicker
                label="Диплом об образовании"
                file={directionFiles.forensicDiploma}
                onSelect={(file) => dispatch({ type: "docFile", key: "forensicDiploma", file })}
              />
              {documentsPicker("forensicDocuments", "Документы о дополнительном образовании")}
            </>
          )}
        </DirectionOption>

        <DirectionOption
          id="RESEARCH"
          title="Научно-исследовательские работы"
          description="Учёная степень, звание и направление научной деятельности"
          checked={state.researchProfile !== null}
          onToggle={() => dispatch({ type: "research", value: state.researchProfile ? null : emptyResearchProfile })}
        >
          {state.researchProfile && (
            <ResearchProfileFields
              value={state.researchProfile}
              onChange={(value) => dispatch({ type: "research", value })}
              catalogs={catalogs.research}
            />
          )}
        </DirectionOption>

        <DirectionOption
          id="LABORATORY"
          title="Лабораторные исследования"
          description="Область аккредитации лаборатории и дополнительные сведения"
          checked={state.laboratoryProfile !== null}
          onToggle={() =>
            dispatch({ type: "laboratory", value: state.laboratoryProfile ? null : emptyLaboratoryProfile })
          }
        >
          {state.laboratoryProfile && (
            <LaboratoryProfileFields
              value={state.laboratoryProfile}
              onChange={(value) => dispatch({ type: "laboratory", value })}
            />
          )}
        </DirectionOption>

        <DirectionOption
          id="TECH_DIAG"
          title="Техническое освидетельствование и диагностирование"
          description="Специалист НК: квалификационные удостоверения, виды и объекты контроля"
          checked={state.techDiagProfile !== null}
          onToggle={() => dispatch({ type: "techDiag", value: state.techDiagProfile ? null : emptyTechDiagProfile })}
        >
          {state.techDiagProfile && (
            <>
              <TechDiagProfileFields
                value={state.techDiagProfile}
                onChange={(value) => dispatch({ type: "techDiag", value })}
                catalogs={catalogs.techDiag}
              />
              {documentsPicker("techDiagDocuments", "Квалификационные удостоверения — до 10 документов")}
            </>
          )}
        </DirectionOption>

        <DirectionOption
          id="DESIGN"
          title="Проектирование промышленных и гражданских объектов"
          description="Специальности по разделам ПД, НОК, НРС и аттестация РТН по промышленной безопасности"
          checked={state.designProfile !== null}
          onToggle={() => dispatch({ type: "design", value: state.designProfile ? null : emptyDesignProfile })}
        >
          {state.designProfile && (
            <>
              <DesignProfileFields
                value={state.designProfile}
                onChange={(value) => dispatch({ type: "design", value })}
                catalogs={catalogs.design}
              />
              {DESIGN_DOCUMENTS.map((group) => documentsPicker(group.key, group.label, 5))}
            </>
          )}
        </DirectionOption>

        <DirectionOption
          id="SURVEY"
          title="Инженерные изыскания"
          description="Направления изысканий, НОК, НРС и аттестация РТН по промышленной безопасности"
          checked={state.surveyProfile !== null}
          onToggle={() => dispatch({ type: "survey", value: state.surveyProfile ? null : emptySurveyProfile })}
        >
          {state.surveyProfile && (
            <>
              <SurveyProfileFields
                value={state.surveyProfile}
                onChange={(value) => dispatch({ type: "survey", value })}
                catalogs={catalogs.survey}
              />
              {SURVEY_DOCUMENTS.map((group) => documentsPicker(group.key, group.label, 5))}
            </>
          )}
        </DirectionOption>

        <DirectionOption
          id="ECOLOGY"
          title="Экологическое сопровождение предприятий"
          description="Виды экологических работ, практические навыки и подтверждающие документы"
          checked={state.ecologyProfile !== null}
          onToggle={() => dispatch({ type: "ecology", value: state.ecologyProfile ? null : emptyEcologyProfile })}
        >
          {state.ecologyProfile && (
            <>
              <EcologyProfileFields
                value={state.ecologyProfile}
                onChange={(value) => dispatch({ type: "ecology", value })}
                catalogs={catalogs.ecology}
              />
              {documentsPicker(
                "ecologyDocuments",
                "Подтверждение квалификационных требований — дипломы, удостоверения, сертификаты",
              )}
            </>
          )}
        </DirectionOption>
      </DirectionList>

      <FormSection
        title="Где вы находитесь"
        hint="Город и район базирования — заказчикам проще выбрать исполнителя рядом. Это не личный адрес, можно заполнить позже в профиле."
        collapsible
      >
        <div className={s.location}>
          <YandexAddressPicker value={state.location} onChange={(point) => dispatch({ type: "location", point })} />
          <Checkbox id="register-travels" checked={state.travels} onChange={(value) => dispatch({ type: "travels", value })}>
            Готов выезжать на объекты в другие регионы
          </Checkbox>
          <ExpertMapVisibilityFields
            showOnMap={state.showOnMap}
            mapFields={state.mapFields}
            onChangeShowOnMap={(value) => dispatch({ type: "showOnMap", value })}
            onChangeMapFields={(value) => dispatch({ type: "mapFields", value })}
            activeDirections={activeDirections(state)}
          />
        </div>
      </FormSection>
    </>
  );
}
