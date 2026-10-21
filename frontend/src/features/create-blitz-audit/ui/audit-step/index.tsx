"use client";

import type { BlitzAuditCatalog } from "@/entities/blitz-order";
import { AUDIT_STEPS } from "../../config/steps";
import { asksSto } from "../../model/payload";
import type { useCreateBlitzAudit } from "../../model/use-create-blitz-audit";
import { ApplicantSection } from "../applicant-section";
import { CommentSection } from "../comment-section";
import { CustomerSection } from "../customer-section";
import { DocumentsSection } from "../documents-section";
import { ObjectsSection } from "../objects-section";
import { ParamsSection } from "../params-section";
import { TermsSection } from "../terms-section";

/** Состояние формы и загруженный справочник. */
interface AuditStepProps {
  form: ReturnType<typeof useCreateBlitzAudit>;
  catalog: BlitzAuditCatalog;
}

/** Раздел текущего шага заявки на аудит. */
export function AuditStep({ form, catalog }: AuditStepProps) {
  const { state, dispatch } = form;

  switch (AUDIT_STEPS[state.step].key) {
    case "applicant":
      return (
        <ApplicantSection
          applicant={state.applicant}
          dispatch={dispatch}
        />
      );
    case "objects":
      return (
        <ObjectsSection
          state={state}
          catalog={catalog}
          dispatch={dispatch}
        />
      );
    case "params":
      return (
        <ParamsSection
          state={state}
          catalog={catalog}
          dispatch={dispatch}
        />
      );
    case "terms":
      return (
        <TermsSection
          state={state}
          catalog={catalog}
          dispatch={dispatch}
        />
      );
    case "documents":
      return (
        <DocumentsSection
          checklist={catalog.checklist}
          entries={form.checklist.entries}
          needsOpoCertificate={state.scope === "all"}
          needsPowerOfAttorney={state.applicant.by_proxy}
          needsSto={Boolean(state.useSto) && asksSto(state.kind)}
          opoCertificate={form.opoCertificate}
          powerOfAttorney={form.powerOfAttorney}
          stoFile={form.stoFile}
          onChecklistAdd={form.checklist.addFiles}
          onChecklistRemove={form.checklist.removeFile}
        />
      );
    case "customer":
      return (
        <CustomerSection
          customerType={state.customerType}
          company={state.company}
          cardItems={form.companyCard.items}
          isCardChosen={form.companyCard.isFull}
          onCardAdd={form.companyCard.addFiles}
          dispatch={dispatch}
        />
      );
    case "comment":
      return (
        <CommentSection
          comment={state.comment}
          dispatch={dispatch}
        />
      );
  }
}