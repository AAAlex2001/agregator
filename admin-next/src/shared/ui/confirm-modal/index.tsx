"use client";

import Button from "@/shared/ui/button";
import Modal from "@/shared/ui/modal";
import styles from "./style.module.scss";

type ConfirmModalProps = {
  open: boolean;
  title: string;
  text: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  pending?: boolean;
};

/** Окно с вопросом, кнопкой «Отмена» и красным подтверждением — для удаления. */
const ConfirmModal = ({ open, title, text, confirmLabel, onConfirm, onCancel, pending }: ConfirmModalProps) => (
  <Modal
    open={open}
    title={title}
    onClose={onCancel}
    footer={
      <>
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button variant="danger" loading={pending} onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <p className={styles.text}>{text}</p>
  </Modal>
);

export default ConfirmModal;
