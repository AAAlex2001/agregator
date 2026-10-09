"use client";

import Button from "@/shared/ui/button";
import ConfirmModal from "@/shared/ui/confirm-modal";
import { TrashIcon } from "@/shared/ui/icons";

type ClarificationActionsProps = {
  title: string;
  confirming: boolean;
  pending: boolean;
  onAskRemove: () => void;
  onCancelRemove: () => void;
  onRemove: () => void;
};

/** Удаление разъяснения через подтверждение. */
const ClarificationActions = ({ title, confirming, pending, onAskRemove, onCancelRemove, onRemove }: ClarificationActionsProps) => (
  <>
    <Button variant="danger" onClick={onAskRemove}>
      <TrashIcon />
      Удалить
    </Button>

    <ConfirmModal
      open={confirming}
      title="Удалить разъяснение?"
      text={`«${title || "Без заголовка"}» исчезнет с сайта вместе с файлами и реакциями.`}
      confirmLabel="Удалить"
      pending={pending}
      onConfirm={onRemove}
      onCancel={onCancelRemove}
    />
  </>
);

export default ClarificationActions;
