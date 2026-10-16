"use client";

import { useAuditOptions } from "@/entities/audit";
import { CADASTRAL_REGISTRY_URL } from "@/entities/cadastral";
import { toDesignSelectOptions, useDesignOrderOptions } from "@/entities/design";
import { toEcologySelectOptions, useEcologyOptions } from "@/entities/ecology";
import {
  AuditOrderFields,
  CadastralOrderFields,
  DesignOrderFields,
  EcologyOrderFields,
  ForensicOrderFields,
  getOrderFormDirection,
  LaboratoryOrderFields,
  OrderFormSection,
  ResearchOrderFields,
  SurveyOrderFields,
  TechDiagOrderFields,
  useOrderForm,
} from "@/entities/order";
import type {
  AuditOrderDocument,
  AuditOrderDocumentKey,
  OrderListItem,
} from "@/entities/order";
import { toSurveyKindSelectOptions, useSurveyOptions } from "@/entities/survey";

/** Соединяет поля выбранного направления с его справочниками и черновиком заказа. */
export function OrderDirectionFields() {
  const { values, dispatch } = useOrderForm();
  const direction = getOrderFormDirection(values);
  const { options: audit } = useAuditOptions(values.workType === "AUDIT_SUPB");
  const { options: design } = useDesignOrderOptions(values.workType === "DESIGN");
  const { options: ecology } = useEcologyOptions(values.workType === "ECOLOGY");
  const { options: survey } = useSurveyOptions(values.workType === "SURVEY");

  /** Применяет условия, пока форма относится к тому же направлению. */
  function changeDetails(details: OrderListItem["details"]) {
    dispatch({
      type: "details/changed",
      workType: values.workType,
      details,
    });
  }

  /** Меняет только документ аудита, сохраняя поля, изменённые во время загрузки. */
  function changeAuditDocument(
    field: AuditOrderDocumentKey,
    document: AuditOrderDocument | null,
  ) {
    dispatch({
      type: "audit-document/changed",
      field,
      document,
    });
  }

  /** Выбирает предметные поля без приведения типов отдельных анкет. */
  function renderDirectionFields() {
    if (!direction.details) {
      return null;
    }

    switch (direction.work_type) {
      case "AUDIT_SUPB":
        return (
          <AuditOrderFields
            value={direction.details}
            onChange={changeDetails}
            onDocumentChange={changeAuditDocument}
            areaOptions={audit.auditAreas}
          />
        );
      case "CADASTRAL":
        return (
          <CadastralOrderFields
            value={direction.details}
            onChange={changeDetails}
            sroRegistryUrl={CADASTRAL_REGISTRY_URL}
          />
        );
      case "DESIGN":
        return (
          <DesignOrderFields
            value={direction.details}
            onChange={changeDetails}
            categoryOptions={toDesignSelectOptions(design.doc_categories)}
            kindOptions={toDesignSelectOptions(design.documentation_kinds)}
            sectionOptions={toDesignSelectOptions(design.specialties)}
            approvalOptions={toDesignSelectOptions(design.approvals)}
          />
        );
      case "ECOLOGY":
        return (
          <EcologyOrderFields
            value={direction.details}
            onChange={changeDetails}
            workTypeOptions={toEcologySelectOptions(ecology.work_types)}
          />
        );
      case "FORENSIC":
        return (
          <ForensicOrderFields
            value={direction.details}
            onChange={changeDetails}
          />
        );
      case "LABORATORY":
        return (
          <LaboratoryOrderFields
            value={direction.details}
            onChange={changeDetails}
          />
        );
      case "RESEARCH":
        return (
          <ResearchOrderFields
            value={direction.details}
            onChange={changeDetails}
          />
        );
      case "SURVEY":
        return (
          <SurveyOrderFields
            value={direction.details}
            onChange={changeDetails}
            kindOptions={toSurveyKindSelectOptions(survey.kinds)}
          />
        );
      case "TECH_DIAG":
        return (
          <TechDiagOrderFields
            value={direction.details}
            onChange={changeDetails}
          />
        );
    }
  }

  return (
    <OrderFormSection>
      {renderDirectionFields()}
    </OrderFormSection>
  );
}
