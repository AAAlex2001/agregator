"use client";

import { Button } from "@/app/components";
import { CommentSection, TechnicalSection, TopSection } from "./sections";
import type { OrderDetails } from "./types";
import styles from "./orderDetailsModal.module.scss";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderDetails | null;
  onRespond?: (order: OrderDetails) => void;
  isResponding?: boolean;
}

export default function OrderDetailsModal({ isOpen, onClose, order, onRespond, isResponding = false }: OrderDetailsModalProps) {
  if (!isOpen || !order) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div className={styles.modal} onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
        <Button
          type="button"
          variant="transparent"
          size="sm"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Закрыть"
        >
          ×
        </Button>

        <TopSection order={order} />
        <CommentSection comment={order.comment} />
        <TechnicalSection
          technicalFiles={order.technicalFiles}
          onRespond={() => onRespond?.(order)}
          isResponding={isResponding}
        />
      </div>
    </div>
  );
}
