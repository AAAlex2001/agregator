"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button, CardInput } from "@/app/components";
import { ReviewStarIcon } from "@/app/icons";
import styles from "./addReviewModal.module.scss";

interface AddReviewModalProps {
  isOpen: boolean;
  customerName: string;
  orderTitle: string;
  expertName: string;
  onClose: () => void;
  onSubmit: (payload: { rating: number; comment: string }) => Promise<void>;
}

export default function AddReviewModal({
  isOpen,
  customerName,
  orderTitle,
  expertName,
  onClose,
  onSubmit,
}: AddReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
    setRating(0);
    setComment("");
  };

  const handleSubmit = async () => {
    if (isSubmitting || rating < 1) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ rating, comment: comment.trim() });
      setRating(0);
      setComment("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          onClick={handleClose}
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
            <div className={styles.titleRow}>
              <h2 className={styles.title}>Оставьте отзыв об исполнителе</h2>
            </div>

            <div className={styles.metaWrap}>
              <div className={styles.metaTop}>
                <div className={styles.customerOrderRow}>
                  <span className={styles.customer}>{customerName}</span>
                  <span className={styles.order}>{orderTitle}</span>
                </div>
              </div>
              <div className={styles.metaBottom}>
                <span className={styles.expert}>Исполнитель: {expertName}</span>
              </div>
            </div>

            <div className={styles.ratingWrap}>
              <span className={styles.sectionTitle}>Оцените работу исполнителя</span>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={styles.starButton}
                    onClick={() => setRating(value)}
                    aria-label={`Оценка ${value}`}
                  >
                    <ReviewStarIcon active={value <= rating} />
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.commentWrap}>
              <span className={styles.commentLabel}>Комментарий</span>
              <CardInput
                value={comment}
                onChange={setComment}
                multiline
                rows={4}
                placeholder="Опишите качество работы, соблюдение сроков и коммуникацию"
                className={styles.commentInput}
              />
            </div>

            <div className={styles.actions}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClose}
                disabled={isSubmitting}
                className={styles.cancelButton}
              >
                Отменить
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => void handleSubmit()}
                disabled={isSubmitting || rating < 1}
                isLoading={isSubmitting}
                className={styles.submitButton}
              >
                Опубликовать отзыв
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
