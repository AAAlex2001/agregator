"use client";

import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { FormSection } from "@/shared/ui/form-section";
import { Loader } from "@/shared/ui/loader";
import { TextArea } from "@/shared/ui/text-area";
import { asksSto } from "../../model/payload";
import { useCreateBlitzAudit } from "../../model/use-create-blitz-audit";
import { ApplicantSection } from "../applicant-section";
import { CustomerSection } from "../customer-section";
import { DocumentsSection } from "../documents-section";
import { ObjectsSection } from "../objects-section";
import { ParamsSection } from "../params-section";
import { TermsSection } from "../terms-section";
import styles from "./style.module.scss";

/** Заявка на аудит СУПБ: заявитель, объекты, параметры, сроки и цена, документы и реквизиты. */
export function CreateBlitzAuditForm() {
  const form = useCreateBlitzAudit();
  const { state, catalog, dispatch } = form;

  if (form.catalogError) {
    return <p className={styles.error}>{form.catalogError}</p>;
  }

  if (!catalog) {
    return <Loader />;
  }

  return (
    <form
      className={styles.form}
      onSubmit={form.submit}
    >
      <ApplicantSection
        applicant={state.applicant}
        dispatch={dispatch}
      />
      <ObjectsSection
        state={state}
        catalog={catalog}
        dispatch={dispatch}
      />
      <ParamsSection
        state={state}
        catalog={catalog}
        dispatch={dispatch}
      />
      <TermsSection
        state={state}
        catalog={catalog}
        dispatch={dispatch}
      />
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
      <CustomerSection
        customerType={state.customerType}
        company={state.company}
        cardItems={form.companyCard.items}
        isCardChosen={form.companyCard.isFull}
        onCardAdd={form.companyCard.addFiles}
        dispatch={dispatch}
      />
      <FormSection title="Комментарий">
        <Field label="Что ещё важно знать аудитору (необязательно)">
          <TextArea
            value={state.comment}
            rows={4}
            maxLength={4000}
            placeholder="Особенности объектов, пожелания к выезду"
            onChange={(event) => dispatch({
              type: "field/change",
              field: "comment",
              value: event.target.value,
            })}
          />
        </Field>
      </FormSection>
      <div className={styles.actions}>
        <Button
          variant="outline"
          href="/blitz"
        >
          Отмена
        </Button>
        <Button
          type="submit"
          isLoading={state.isSubmitting}
        >
          Отправить заявку
        </Button>
      </div>
    </form>
  );
}