"use client";

import type { ContactDealListItem } from "@/source/entities/expert-contact";
import { Button, Modal, Title } from "@/source/shared/ui";
import s from "./DeleteContactDealModal.module.scss";

interface DeleteContactDealModalProps {
  deal: ContactDealListItem | null;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteContactDealModal({
  deal,
  busy,
  onClose,
  onConfirm,
}: DeleteContactDealModalProps) {
  return (
    <Modal
      open={deal !== null}
      onClose={onClose}
      isBusy={busy}
      size="sm"
      ariaLabel="Удалить заявку на контакты?"
    >
      <div className={s.content}>
        <Title
          text="Удалить заявку на контакты?"
          as="h2"
          className={s.title}
        />
        <p>
          Заявка исчезнет из вашего списка. Эксперт и история сделки сохранятся
          для учёта действий.
        </p>
        <div className={s.actions}>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={busy}
          >
            Отмена
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={busy}
          >
            Удалить
          </Button>
        </div>
      </div>
    </Modal>
  );
}
