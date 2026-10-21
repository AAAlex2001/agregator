"use client";

import type { BlitzCatalog } from "@/entities/blitz-order";
import { ORDER_STEPS } from "../../config/steps";
import type { useCreateBlitzOrder } from "../../model/use-create-blitz-order";
import { CommentSection } from "../comment-section";
import { CustomerSection } from "../customer-section";
import { DocumentsSection } from "../documents-section";
import { PriceSection } from "../price-section";
import { SubjectSection } from "../subject-section";

/** Состояние формы и загруженный справочник. */
interface OrderStepProps {
  form: ReturnType<typeof useCreateBlitzOrder>;
  catalog: BlitzCatalog;
}

/** Раздел текущего шага заявки на экспертизу. */
export function OrderStep({ form, catalog }: OrderStepProps) {
  const { state } = form;

  switch (ORDER_STEPS[state.step].key) {
    case "subject":
      return (
        <SubjectSection
          state={state}
          catalog={catalog}
          onObjectChange={form.changeObject}
          onAreaChange={form.changeArea}
          onRequirementChange={form.changeRequirement}
          onFieldChange={form.changeField}
          onDeadlineChange={form.changeDeadline}
        />
      );
    case "price":
      return (
        <PriceSection
          price={state.price}
          tariff={form.tariff}
          onChange={(value) => form.changeField("price", value)}
        />
      );
    case "documents":
      return (
        <DocumentsSection
          items={form.documentation.items}
          isFull={form.documentation.isFull}
          onAdd={form.documentation.addFiles}
        />
      );
    case "customer":
      return (
        <CustomerSection
          state={state}
          cardItems={form.companyCard.items}
          isCardChosen={form.companyCard.isFull}
          onTypeChange={form.changeCustomerType}
          onCompanyChange={form.changeCompany}
          onIndividualChange={form.changeIndividual}
          onCardAdd={form.companyCard.addFiles}
        />
      );
    case "comment":
      return (
        <CommentSection
          comment={state.comment}
          onChange={(value) => form.changeField("comment", value)}
        />
      );
  }
}