"use client";

import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import Input from "@/shared/ui/input";
import Loader from "@/shared/ui/loader";
import Message from "@/shared/ui/message";
import Panel from "@/shared/ui/panel";
import { MIN_AUDIT_TARIFF, useAuditTariff } from "./use-audit-tariff";
import styles from "./style.module.scss";

/** Тариф аудита СУПБ: ориентир цены в форме заявки на аудит, не ниже 100 000 ₽. */
export function AuditTariffForm() {
  const tariff = useAuditTariff();

  return (
    <Panel title="Аудит СУПБ, ₽">
      {tariff.error && <Message tone="error">{tariff.error}</Message>}
      {!tariff.loaded && !tariff.error && <Loader />}
      {tariff.loaded && (
        <div className={styles.audit}>
          <Field
            label="Тариф аудита"
            hint={`Не менее ${MIN_AUDIT_TARIFF.toLocaleString("ru-RU")} ₽. Пустое поле — без ориентира`}
            error={tariff.tooLow ? `Тариф аудита — не менее ${MIN_AUDIT_TARIFF.toLocaleString("ru-RU")} ₽` : undefined}
          >
            <Input
              value={tariff.value}
              placeholder="Например, 300 000"
              ariaLabel="Тариф аудита"
              onChange={tariff.changeValue}
            />
          </Field>
          <Button loading={tariff.saving} disabled={tariff.tooLow} onClick={() => void tariff.save()}>
            Сохранить тариф аудита
          </Button>
        </div>
      )}
    </Panel>
  );
}