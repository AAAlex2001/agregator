"use client";

import type { Deal } from "@/entities/contact-deal";
import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import Panel from "@/shared/ui/panel";
import Textarea from "@/shared/ui/textarea";
import styles from "./style.module.scss";

type ReleaseFormProps = {
  deal: Deal;
  note: string;
  pending: boolean;
  canRelease: boolean;
  onChange: (value: string) => void;
  onRelease: () => void;
};

/** Ручная выдача контактов покупателю, а после выдачи — сами контакты и пояснение. */
const ReleaseForm = ({ deal, note, pending, canRelease, onChange, onRelease }: ReleaseFormProps) => {
  if (deal.status === "CONTACTS_RELEASED") {
    return (
      <Panel title="Контакты выданы">
        <div className={styles.contacts}>
          {deal.seller_contacts?.phone && <span>Телефон: {deal.seller_contacts.phone}</span>}
          {deal.seller_contacts?.email && <span>Email: {deal.seller_contacts.email}</span>}
          {deal.release_note && <span className={styles.note}>Пояснение: {deal.release_note}</span>}
        </div>
      </Panel>
    );
  }

  return (
    <Panel title="Ручная выдача контактов">
      <form
        className={styles.form}
        onSubmit={(event) => {
          event.preventDefault();
          onRelease();
        }}
      >
        <Field label="Пояснение" hint="Останется в журнале сделки: почему контакты выданы вручную">
          <Textarea ariaLabel="Пояснение" rows={3} maxLength={2000} value={note} onChange={onChange} />
        </Field>

        <Button type="submit" loading={pending} disabled={!canRelease}>
          Выдать контакты покупателю
        </Button>
      </form>
    </Panel>
  );
};

export default ReleaseForm;
