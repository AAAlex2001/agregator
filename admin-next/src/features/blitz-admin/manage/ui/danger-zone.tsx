"use client";

import { useState } from "react";
import { cancelBlitzOrder, deleteBlitzOrder } from "@/entities/blitz-order";
import { errorMessage } from "@/shared/lib/errors";
import Button from "@/shared/ui/button";
import ConfirmModal from "@/shared/ui/confirm-modal";
import Field from "@/shared/ui/field";
import Modal from "@/shared/ui/modal";
import Panel from "@/shared/ui/panel";
import Textarea from "@/shared/ui/textarea";
import { useToast } from "@/shared/ui/toaster";
import { useBlitzCommand } from "../model/use-blitz-command";
import type { BlitzCommandProps } from "../model/types";
import styles from "./style.module.scss";

type DangerZoneProps = BlitzCommandProps & {
  onDeleted: () => void;
};

/** Отмена заявки с причиной и удаление вместе с файлами. */
export function DangerZone({ order, onChange, onDeleted }: DangerZoneProps) {
  const [canceling, setCanceling] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [reason, setReason] = useState("");
  const [removing, setRemoving] = useState(false);
  const command = useBlitzCommand(onChange);
  const toast = useToast();
  const finished = order.status === "accepted" || order.status === "canceled";

  async function cancel() {
    const done = await command.run(() => cancelBlitzOrder(order.id, reason.trim()), "Заявка отменена");

    if (done) setCanceling(false);
  }

  async function remove() {
    setRemoving(true);

    try {
      await deleteBlitzOrder(order.id);
      toast("Заявка удалена");
      onDeleted();
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось удалить заявку"), "error");
      setRemoving(false);
    }
  }

  return (
    <Panel title="Отмена и удаление">
      <div className={styles.row}>
        {!finished && (
          <Button variant="outline" onClick={() => setCanceling(true)}>
            Отменить заявку
          </Button>
        )}
        <Button variant="danger" onClick={() => setDeleting(true)}>
          Удалить
        </Button>
      </div>

      <Modal
        open={canceling}
        title={`Отменить заявку №${order.id}?`}
        onClose={() => setCanceling(false)}
        footer={
          <Button loading={command.pending} disabled={reason.trim().length < 3} onClick={() => void cancel()}>
            Отменить заявку
          </Button>
        }
      >
        <Field label="Причина" hint="Её увидят заказчик и эксперт. Неоплаченные счета аннулируются">
          <Textarea value={reason} rows={3} maxLength={1000} onChange={setReason} />
        </Field>
      </Modal>

      <ConfirmModal
        open={deleting}
        title="Удалить заявку?"
        text="Заявка, её файлы, счета и история будут удалены без возможности восстановления."
        confirmLabel="Удалить"
        pending={removing}
        onCancel={() => setDeleting(false)}
        onConfirm={() => void remove()}
      />
    </Panel>
  );
}
