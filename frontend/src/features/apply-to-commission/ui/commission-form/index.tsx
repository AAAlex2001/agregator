"use client";

import { Button } from "@/shared/ui/button";
import { Field } from "@/shared/ui/field";
import { Loader } from "@/shared/ui/loader";
import { TextArea } from "@/shared/ui/text-area";
import { TextInput } from "@/shared/ui/text-input";
import { useCommissionForm } from "../../model/use-commission-form";
import { AttestationList } from "../attestation-list";
import { AttestationPicker } from "../attestation-picker";
import styles from "./style.module.scss";

/** Заявка кандидата: контакты, аттестации и рассказ о себе. После отправки — благодарность. */
export function CommissionForm() {
  const form = useCommissionForm();
  const { state } = form;

  if (state.isSent) {
    return (
      <div className={styles.sent}>
        <h2 className={styles.sentTitle}>Заявка передана в конкурсную комиссию</h2>
        <p className={styles.sentText}>
          Спасибо! Мы прислали подтверждение на почту. Комиссия рассмотрит вашу кандидатуру
          и сообщит решение письмом.
        </p>
      </div>
    );
  }

  if (form.catalogError) {
    return <p className={styles.error}>{form.catalogError}</p>;
  }

  if (!form.catalog) {
    return <Loader />;
  }

  return (
    <form
      className={styles.form}
      onSubmit={form.submit}
    >
      <div className={styles.grid}>
        <Field label="ФИО">
          <TextInput
            value={state.fullName}
            maxLength={255}
            placeholder="Иванов Иван Иванович"
            autoComplete="name"
            onChange={(event) => form.changeContact("fullName", event.target.value)}
          />
        </Field>
        <Field label="Телефон">
          <TextInput
            type="tel"
            value={state.phone}
            maxLength={32}
            placeholder="+7 900 000-00-00"
            autoComplete="tel"
            onChange={(event) => form.changeContact("phone", event.target.value)}
          />
        </Field>
        <Field label="Почта">
          <TextInput
            type="email"
            value={state.email}
            maxLength={320}
            placeholder="ivanov@mail.ru"
            autoComplete="email"
            onChange={(event) => form.changeContact("email", event.target.value)}
          />
        </Field>
      </div>

      <Field
        label="Аттестации"
        hint="Добавьте все области, по которым у вас есть действующая аттестация эксперта"
      >
        <AttestationPicker
          catalog={form.catalog}
          draft={state.draft}
          isReady={form.isDraftReady}
          onChange={form.changeDraft}
          onAdd={form.addAttestation}
        />
        {state.attestations.length > 0 && (
          <AttestationList
            attestations={state.attestations}
            onRemove={form.removeAttestation}
          />
        )}
      </Field>

      <Field label="О себе (необязательно)">
        <TextArea
          value={state.message}
          rows={4}
          maxLength={2000}
          placeholder="Опыт, регион, с какими объектами работали"
          onChange={(event) => form.changeContact("message", event.target.value)}
        />
      </Field>

      <Button
        type="submit"
        isLoading={state.isSubmitting}
        disabled={!form.canSubmit}
      >
        Отправить заявку в комиссию
      </Button>
    </form>
  );
}
