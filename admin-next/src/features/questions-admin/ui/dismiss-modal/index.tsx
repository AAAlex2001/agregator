"use client";

import Button from "@/shared/ui/button";
import Field from "@/shared/ui/field";
import Modal from "@/shared/ui/modal";
import Textarea from "@/shared/ui/textarea";

type DismissModalProps = {
  open: boolean;
  reason: string;
  pending: boolean;
  onChange: (value: string) => void;
  onConfirm: () => void;
  onClose: () => void;
};

/** Окно отклонения вопроса: причина обязательна, её увидит автор. */
const DismissModal = ({ open, reason, pending, onChange, onConfirm, onClose }: DismissModalProps) => (
  <Modal
    open={open}
    title="Отклонить вопрос"
    onClose={onClose}
    footer={
      <>
        <Button variant="outline" onClick={onClose}>
          Отмена
        </Button>
        <Button variant="danger" loading={pending} disabled={!reason.trim()} onClick={onConfirm}>
          Отклонить
        </Button>
      </>
    }
  >
    <Field label="Причина" hint="Автор вопроса увидит этот текст">
      <Textarea ariaLabel="Причина отклонения" rows={3} maxLength={1000} value={reason} onChange={onChange} />
    </Field>
  </Modal>
);

export default DismissModal;
