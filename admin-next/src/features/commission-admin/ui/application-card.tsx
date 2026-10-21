"use client";

import { useState } from "react";
import {
  APPLICATION_STATUS_LABELS,
  APPLICATION_STATUS_TONES,
  APPLICATION_STATUSES,
  deleteApplication,
  reviewApplication,
  type CommissionApplication,
} from "@/entities/commission-application";
import { formatDateTime } from "@/shared/lib/date";
import { errorMessage } from "@/shared/lib/errors";
import Badge from "@/shared/ui/badge";
import Button from "@/shared/ui/button";
import ConfirmModal from "@/shared/ui/confirm-modal";
import Field from "@/shared/ui/field";
import Panel from "@/shared/ui/panel";
import Select from "@/shared/ui/select";
import Textarea from "@/shared/ui/textarea";
import { useToast } from "@/shared/ui/toaster";
import styles from "./style.module.scss";

type ApplicationCardProps = {
  application: CommissionApplication;
  onChange: (application: CommissionApplication) => void;
  onDeleted: () => void;
};

const STATUS_OPTIONS = APPLICATION_STATUSES.map((status) => ({ value: status, label: APPLICATION_STATUS_LABELS[status] }));

/** Заявка кандидата: контакты, аттестации, решение комиссии с комментарием и удаление. */
export function ApplicationCard({ application, onChange, onDeleted }: ApplicationCardProps) {
  const toast = useToast();
  const [status, setStatus] = useState(application.status);
  const [decision, setDecision] = useState(application.decision ?? "");
  const [pending, setPending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function save() {
    setPending(true);

    try {
      onChange(await reviewApplication(application.id, status, decision.trim()));
      toast(status === application.status ? "Комментарий сохранён" : "Решение сохранено, кандидату ушло письмо");
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось сохранить решение"), "error");
    } finally {
      setPending(false);
    }
  }

  async function remove() {
    setPending(true);

    try {
      await deleteApplication(application.id);
      toast("Заявка удалена");
      onDeleted();
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось удалить заявку"), "error");
      setPending(false);
    }
  }

  return (
    <Panel
      title={`№${application.id} · ${application.full_name}`}
      action={
        <Badge tone={APPLICATION_STATUS_TONES[application.status]}>
          {APPLICATION_STATUS_LABELS[application.status]}
        </Badge>
      }
    >
      <div className={styles.body}>
        <div className={styles.contacts}>
          <a href={`tel:${application.phone}`}>{application.phone}</a>
          <a href={`mailto:${application.email}`}>{application.email}</a>
          <span className={styles.meta}>Подана {formatDateTime(application.created_at)}</span>
        </div>

        <ul className={styles.attestations}>
          {application.attestations.map((item) => (
            <li key={`${item.area_code}-${item.object_code}-${item.category}`}>
              {item.area_code} {item.object_code} · {item.category} категория
            </li>
          ))}
        </ul>

        {application.message && <p className={styles.message}>{application.message}</p>}

        <div className={styles.review}>
          <Field label="Статус">
            <Select
              value={status}
              options={STATUS_OPTIONS}
              ariaLabel="Статус заявки"
              onChange={(value) => setStatus(APPLICATION_STATUSES.find((item) => item === value) ?? status)}
            />
          </Field>
          <Field label="Комментарий кандидату" hint="Попадёт в письмо, когда статус изменится">
            <Textarea value={decision} rows={2} maxLength={2000} onChange={setDecision} />
          </Field>
        </div>

        <div className={styles.actions}>
          <Button loading={pending} onClick={() => void save()}>
            Сохранить
          </Button>
          <Button variant="danger" disabled={pending} onClick={() => setDeleting(true)}>
            Удалить
          </Button>
        </div>
      </div>

      <ConfirmModal
        open={deleting}
        title={`Удалить заявку №${application.id}?`}
        text="Заявка кандидата будет удалена без возможности восстановления."
        confirmLabel="Удалить"
        pending={pending}
        onCancel={() => setDeleting(false)}
        onConfirm={() => void remove()}
      />
    </Panel>
  );
}
