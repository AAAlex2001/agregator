"use client";

import { AnimatePresence, motion } from "framer-motion";
import Button from "@/source/shared/ui/Button";
import s from "./CompletionModal.module.scss";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onLeaveReview?: () => void;
}

export function CompletionModal({ isOpen, onClose, onLeaveReview }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={s.overlay}
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <motion.div
            className={s.modal}
            onClick={(event) => event.stopPropagation()}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <div className={s.content}>
              <div className={s.title}>Проект успешно завершён</div>
              <div className={s.subtitle}>Теперь вы можете оставить отзыв</div>
            </div>

            <div className={s.actions}>
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