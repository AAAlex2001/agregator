"use client";

import { BlitzFilePicker } from "@/entities/blitz-order";
import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { FormSection } from "@/shared/ui/form-section";
import { Loader } from "@/shared/ui/loader";
import { TextArea } from "@/shared/ui/text-area";
import { useCreateBlitzOrder } from "../../model/use-create-blitz-order";
import { CustomerSection } from "../customer-section";
import { PriceSection } from "../price-section";
import { SubjectSection } from "../subject-section";
import styles from "./style.module.scss";

/** Кто что видит в заявке. */
const DOCUMENTS_HINT = "Эксперты видят документацию до того, как взять заявку. "
  + "Реквизиты — только тот, кто взял";

/** Новая заявка: что проверить, цена, заказчик, документация и комментарий. */
export function CreateBlitzOrderForm() {
  const form = useCreateBlitzOrder();
  const { state, catalog } = form;

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
      <SubjectSection
        state={state}
        catalog={catalog}
        onObjectChange={form.changeObject}
        onAreaChange={form.changeArea}
        onRequirementChange={form.changeRequirement}
        onFieldChange={form.changeField}
        onDeadlineChange={form.changeDeadline}
      />
      <PriceSection
        price={state.price}
        tariff={form.tariff}
        onChange={(value) => form.changeField("price", value)}
      />
      <FormSection
        title="Документация"
        hint={DOCUMENTS_HINT}
      >
        <BlitzFilePicker
          label="Файлы документации"
          items={form.documentation.items}
          isFull={form.documentation.isFull}
          onAdd={form.documentation.addFiles}
        />
        <Field label="Комментарий (необязательно)">
          <TextArea
            value={state.comment}
            rows={4}
            maxLength={4000}
            placeholder="Что важно знать эксперту"
            onChange={(event) => form.changeField("comment", event.target.value)}
          />
        </Field>
      </FormSection>
      <CustomerSection
        state={state}
        cardItems={form.companyCard.items}
        isCardChosen={form.companyCard.isFull}
        onTypeChange={form.changeCustomerType}
        onCompanyChange={form.changeCompany}
        onIndividualChange={form.changeIndividual}
        onCardAdd={form.companyCard.addFiles}
      />
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
