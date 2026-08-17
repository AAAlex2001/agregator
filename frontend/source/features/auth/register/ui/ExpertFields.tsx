"use client";

import { useEffect, useState } from "react";
import { Checkbox, FormSection } from "@/source/shared/ui";
import { YandexAddressPicker } from "@/source/shared/ui/YandexMap";
import { ExpertMapVisibilityFields } from "@/source/entities/expert";
import {
  emptyExpertiseProfile,
  ExpertiseProfileFields,
} from "@/source/features/directions/expertise";
import {
  AuditExpertProfileFields,
  emptyAuditCatalogs,
  emptyAuditExpertProfile,
  fetchAuditCatalogs,
  type AuditCatalogs,
} from "@/source/features/directions/audit";
import {
  CadastralProfileFields,
  emptyCadastralProfile,
} from "@/source/features/directions/cadastral";
import { emptyForensicProfile, ForensicProfileFields } from "@/source/features/directions/forensic";
import { emptyResearchProfile, ResearchProfileFields } from "@/source/features/directions/research";
import {
  emptyLaboratoryProfile,
  LaboratoryProfileFields,
} from "@/source/features/directions/laboratory";
import {
  emptyTechDiagCatalogs,
  emptyTechDiagProfile,
  fetchTechDiagCatalogs,
  TechDiagProfileFields,
  type TechDiagCatalogs,
} from "@/source/features/directions/tech-diag";
import {
  DesignProfileFields,
  emptyDesignCatalogs,
  emptyDesignProfile,
  fetchDesignCatalogs,
  type DesignCatalogs,
} from "@/source/features/directions/design";
import { LocalFilePicker } from "@/source/features/directions/shared/ui/LocalFilePicker";
import { LocalFilesPicker } from "@/source/features/directions/shared/ui/LocalFilesPicker";
import { DirectionOption } from "./directions/DirectionOption";
import type { StepProps } from "./types";
import s from "./register-form.module.scss";
import d from "./directions/DirectionsPicker.module.scss";

function activeDirections(state: StepProps["state"]): string[] {
  const profiles: Array<[string, unknown]> = [
    ["EXPERTISE", state.expertiseProfile],
    ["AUDIT_SUPB", state.auditExpertProfile],
    ["TECH_DIAG", state.techDiagProfile],
    ["DESIGN", state.designProfile],
    ["RESEARCH", state.researchProfile],
    ["LABORATORY", state.laboratoryProfile],
    ["CADASTRAL", state.cadastralProfile],
    ["FORENSIC", state.forensicProfile],
  ];
  return profiles.filter(([, profile]) => profile !== null).map(([key]) => key);
}

export function ExpertFields({ state, dispatch }: StepProps) {
  const [catalogs, setCatalogs] = useState<AuditCatalogs>(emptyAuditCatalogs);
  const [techDiagCatalogs, setTechDiagCatalogs] = useState<TechDiagCatalogs>(emptyTechDiagCatalogs);
  const [designCatalogs, setDesignCatalogs] = useState<DesignCatalogs>(emptyDesignCatalogs);

  useEffect(() => {
    fetchAuditCatalogs().then(setCatalogs).catch(() => undefined);
    fetchTechDiagCatalogs().then(setTechDiagCatalogs).catch(() => undefined);
    fetchDesignCatalogs().then(setDesignCatalogs).catch(() => undefined);
  }, []);

  const { expertiseProfile, auditExpertProfile, cadastralProfile, forensicProfile } = state;

  return (
    <>
      <ul className={d.list}>
        <DirectionOption
          id="EXPERTISE"
          title="Экспертиза промышленной безопасности"
          description="Удостоверения: область аттестации, объект экспертизы и категория"
          checked={expertiseProfile !== null}
          onToggle={() =>
            dispatch({ type: "expertise", value: expertiseProfile ? null : { ...emptyExpertiseProfile } })
          }
        >
          {expertiseProfile && (
            <ExpertiseProfileFields
              value={expertiseProfile}
              onChange={(value) => dispatch({ type: "expertise", value })}
            />
          )}
        </DirectionOption>

        <DirectionOption
          id="AUDIT_SUPB"
          title="Аудит СУПБ"
          description="Аудитор с независимой оценкой квалификации или инспекционный орган типа А"
          checked={auditExpertProfile !== null}
          onToggle={() =>
            dispatch({ type: "auditExpert", value: auditExpertProfile ? null : { ...emptyAuditExpertProfile } })
          }
        >
          {auditExpertProfile && (
            <>
              <AuditExpertProfileFields
                value={auditExpertProfile}
                onChange={(value) => dispatch({ type: "auditExpert", value })}
                catalogs={catalogs}
              />
              <LocalFilesPicker
                label="Дипломы, аттестаты, курсы"
                files={state.directionFiles.auditDocuments}
                onAdd={(files) => dispatch({ type: "docAdd", key: "auditDocuments", files })}
                onRemove={(index) => dispatch({ type: "docRemove", key: "auditDocuments", index })}
              />
            </>
          )}
        </DirectionOption>

        <DirectionOption
          id="CADASTRAL"
          title="Кадастровые работы"
          description="Аттестат кадастрового инженера, оборудование и место работы"
          checked={cadastralProfile !== null}
          onToggle={() =>
            dispatch({ type: "cadastral", value: cadastralProfile ? null : { ...emptyCadastralProfile } })
          }
        >
          {cadastralProfile && (
            <>
              <CadastralProfileFields
                value={cadastralProfile}
                onChange={(value) => dispatch({ type: "cadastral", value })}
              />
              <LocalFilePicker
                label="Диплом об образовании"
                file={state.directionFiles.cadastralDiploma}
                onSelect={(file) => dispatch({ type: "docFile", key: "cadastralDiploma", file })}
              />
              <LocalFilePicker
                label="Квалификационный аттестат"
                file={state.directionFiles.cadastralCertificate}
                onSelect={(file) => dispatch({ type: "docFile", key: "cadastralCertificate", file })}
              />
              <LocalFilesPicker
                label="Дипломы, аттестаты, курсы"
                files={state.directionFiles.cadastralDocuments}
                onAdd={(files) => dispatch({ type: "docAdd", key: "cadastralDocuments", files })}
                onRemove={(index) => dispatch({ type: "docRemove", key: "cadastralDocuments", index })}
              />
            </>
          )}
        </DirectionOption>

        <DirectionOption
          id="FORENSIC"
          title="Судебная экспертиза"
          description="Образование, опыт аналогичных экспертиз и кто выдаёт заключение"
          checked={forensicProfile !== null}
          onToggle={() =>
            dispatch({ type: "forensic", value: forensicProfile ? null : { ...emptyForensicProfile } })
          }
        >
          {forensicProfile && (
            <>
              <ForensicProfileFields
                value={forensicProfile}
                onChange={(value) => dispatch({ type: "forensic", value })}
              />
              <LocalFilePicker
                label="Диплом об образовании"
                file={state.directionFiles.forensicDiploma}
                onSelect={(file) => dispatch({ type: "docFile", key: "forensicDiploma", file })}
              />
              <LocalFilesPicker
                label="Документы о дополнительном образовании"
                files={state.directionFiles.forensicDocuments}
                onAdd={(files) => dispatch({ type: "docAdd", key: "forensicDocuments", files })}
                onRemove={(index) => dispatch({ type: "docRemove", key: "forensicDocuments", index })}
              />
            </>
          )}
        </DirectionOption>

        <DirectionOption
          id="RESEARCH"
          title="Научно-исследовательские работы"
          description="Учёная степень, звание и направление научной деятельности"
          checked={state.researchProfile !== null}
          onToggle={() =>
            dispatch({ type: "research", value: state.researchProfile ? null : { ...emptyResearchProfile } })
          }
        >
          {state.researchProfile && (
            <ResearchProfileFields
              value={state.researchProfile}
              onChange={(value) => dispatch({ type: "research", value })}
            />
          )}
        </DirectionOption>

        <DirectionOption
          id="LABORATORY"
          title="Лабораторные исследования"
          description="Область аккредитации лаборатории и дополнительные сведения"
          checked={state.laboratoryProfile !== null}
          onToggle={() =>
            dispatch({ type: "laboratory", value: state.laboratoryProfile ? null : { ...emptyLaboratoryProfile } })
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
          onToggle={() =>
            dispatch({ type: "techDiag", value: state.techDiagProfile ? null : { ...emptyTechDiagProfile } })
          }
        >
          {state.techDiagProfile && (
            <>
              <TechDiagProfileFields
                value={state.techDiagProfile}
                onChange={(value) => dispatch({ type: "techDiag", value })}
                catalogs={techDiagCatalogs}
              />
              <LocalFilesPicker
                label="Квалификационные удостоверения — до 10 документов"
                files={state.directionFiles.techDiagDocuments}
                onAdd={(files) => dispatch({ type: "docAdd", key: "techDiagDocuments", files })}
                onRemove={(index) => dispatch({ type: "docRemove", key: "techDiagDocuments", index })}
              />
            </>
          )}
        </DirectionOption>

        <DirectionOption
          id="DESIGN"
          title="Проектирование промышленных и гражданских объектов"
          description="Специальности по разделам ПД, НОК, НРС и аттестация РТН по промышленной безопасности"
          checked={state.designProfile !== null}
          onToggle={() =>
            dispatch({ type: "design", value: state.designProfile ? null : { ...emptyDesignProfile } })
          }
        >
          {state.designProfile && (
            <>
              <DesignProfileFields
                value={state.designProfile}
                onChange={(value) => dispatch({ type: "design", value })}
                catalogs={designCatalogs}
              />
              <LocalFilesPicker
                label="Диплом об образовании — до 5 документов"
                files={state.directionFiles.designEducationDocuments}
                maxFiles={5}
                onAdd={(files) => dispatch({ type: "docAdd", key: "designEducationDocuments", files })}
                onRemove={(index) => dispatch({ type: "docRemove", key: "designEducationDocuments", index })}
              />
              <LocalFilesPicker
                label="Свидетельства НОК — до 5 документов"
                files={state.directionFiles.designNokDocuments}
                maxFiles={5}
                onAdd={(files) => dispatch({ type: "docAdd", key: "designNokDocuments", files })}
                onRemove={(index) => dispatch({ type: "docRemove", key: "designNokDocuments", index })}
              />
              <LocalFilesPicker
                label="Уведомления о включении в НРС — до 5 документов"
                files={state.directionFiles.designNrsDocuments}
                maxFiles={5}
                onAdd={(files) => dispatch({ type: "docAdd", key: "designNrsDocuments", files })}
                onRemove={(index) => dispatch({ type: "docRemove", key: "designNrsDocuments", index })}
              />
              <LocalFilesPicker
                label="Повышение квалификации, курсы — до 5 документов"
                files={state.directionFiles.designQualificationDocuments}
                maxFiles={5}
                onAdd={(files) => dispatch({ type: "docAdd", key: "designQualificationDocuments", files })}
                onRemove={(index) => dispatch({ type: "docRemove", key: "designQualificationDocuments", index })}
              />
              <LocalFilesPicker
                label="Протоколы аттестации РТН — до 5 документов"
                files={state.directionFiles.designRtnDocuments}
                maxFiles={5}
                onAdd={(files) => dispatch({ type: "docAdd", key: "designRtnDocuments", files })}
                onRemove={(index) => dispatch({ type: "docRemove", key: "designRtnDocuments", index })}
              />
            </>
          )}
        </DirectionOption>
      </ul>

      <FormSection
        title="Где вы находитесь"
        hint="Город и район базирования — заказчикам проще выбрать исполнителя рядом. Это не личный адрес, можно заполнить позже в профиле."
        collapsible
      >
        <div className={s.locationBlock}>
          <YandexAddressPicker
            value={state.location}
            onChange={(point) => dispatch({ type: "location", point })}
          />
          <Checkbox
            id="travels"
            checked={state.travels}
            onChange={(value) => dispatch({ type: "travels", value })}
          >
            Готов выезжать на объекты в другие регионы
          </Checkbox>
        </div>

        <ExpertMapVisibilityFields
          showOnMap={state.showOnMap}
          mapFields={state.mapFields}
          onChangeShowOnMap={(value) => dispatch({ type: "showOnMap", value })}
          onChangeMapFields={(value) => dispatch({ type: "mapFields", value })}
          activeDirections={activeDirections(state)}
        />
      </FormSection>
    </>
  );
}
