"use client";

import { AnimatePresence, motion } from "framer-motion";
import Button from "@/source/shared/ui/Button";
import CardInput from "@/source/shared/ui/CardInput";
import { ReviewStarIcon } from "@/source/shared/ui/icons";
import s from "./AddReviewModal.module.scss";

interface Props {
  isOpen: boolean;
  customerName: string;
  orderTitle: string;
  expertName: string;
  rating: number;
  comment: string;
  isSubmitting: boolean;
  onClose: () => void;
  onRatingChange: (value: number) => void;
  onCommentChange: (value: string) => void;
  onSubmit: () => void;
}

export function AddReviewModal({
  isOpen,
  customerName,
  orderTitle,
  expertName,
  rating,
  comment,
  isSubmitting,
  onClose,
  onRatingChange,
  onCommentChange,
  onSubmit,
}: Props) {
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
            <div className={s.titleRow}>
              <h2 className={s.title}>Оставьте отзыв об исполнителе</h2>
            </div>

            <div className={s.metaWrap}>
              <div className={s.metaTop}>
                <div className={s.customerOrderRow}>
                  <span className={s.customer}>{customerName}</span>
                  <span className={s.order}>{orderTitle}</span>
                </div>
              </div>

              <div className={s.metaBottom}>
                <span className={s.expert}>Исполнитель: {expertName}</span>
              </div>
            </div>

            <div className={s.ratingWrap}>
              <span className={s.sectionTitle}>Оцените работу исполнителя</span>

              <div className={s.stars}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={s.starButton}
                    onClick={() => onRatingChange(value)}
                    aria-label={`Оценка ${value}`}
                  >
                    <ReviewStarIcon active={value <= rating} />
                  </button>
                ))}
              </div>
            </div>

            <div className={s.commentWrap}>
              <span className={s.commentLabel}>Комментарий</span>

              <CardInput
                value={comment}
                onChange={onCommentChange}
                multiline
                rows={4}
                placeholder="Опишите качество работы, соблюдение сроков и коммуникацию"
                className={s.commentInput}
              />
            </div>

            <div className={s.actions}>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
                className={s.cancelButton}
              >
                Отменить
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={onSubmit}
                disabled={isSubmitting || rating < 1}
                isLoading={isSubmitting}
                className={s.submitButton}
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