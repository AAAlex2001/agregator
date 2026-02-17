"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/app/components";
import styles from "./completionModal.module.scss";

interface CompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLeaveReview?: () => void;
}

export default function CompletionModal({
  isOpen,
  onClose,
  onLeaveReview,
}: CompletionModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <motion.div
            className={styles.modal}
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <div className={styles.content}>
              <div className={styles.title}>Проект успешно завершён</div>
              <div className={styles.subtitle}>Теперь вы можете оставить отзыв</div>
            </div>
            <div className={styles.actions}>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={() => {
                  onClose();
                  onLeaveReview?.();
                }}
              >
                Оставить отзыв
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
