"use client";

import Button from "@/shared/ui/button";
import ConfirmModal from "@/shared/ui/confirm-modal";
import { TrashIcon } from "@/shared/ui/icons";

type ArticleActionsProps = {
  title: string;
  confirming: boolean;
  pending: boolean;
  onAskRemove: () => void;
  onCancelRemove: () => void;
  onRemove: () => void;
};

/** Удаление статьи через подтверждение. */
const ArticleActions = ({ title, confirming, pending, onAskRemove, onCancelRemove, onRemove }: ArticleActionsProps) => (
  <>
    <Button variant="danger" onClick={onAskRemove}>
      <TrashIcon />
      Удалить
    </Button>

    <ConfirmModal
      open={confirming}
      title="Удалить статью?"
      text={`«${title || "Без заголовка"}» будет удалена вместе с комментариями и реакциями.`}
      confirmLabel="Удалить"
      pending={pending}
      onConfirm={onRemove}
      onCancel={onCancelRemove}
    />
  </>
);

export default ArticleActions;
