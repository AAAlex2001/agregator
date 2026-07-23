"use client";

import Button from "@/source/shared/ui/Button";
import CardInput from "@/source/shared/ui/CardInput";
import { Modal } from "@/source/shared/ui";
import { ReviewStarIcon } from "@/source/shared/ui/icons";
import s from "./AddReviewModal.module.scss";

interface Props {
  isOpen: boolean;
  customerName: string;
  orderTitle: string;
  expertName: string;
  title?: string;
  ratingLabel?: string;
  commentPlaceholder?: string;
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
  title = "Оставьте отзыв об исполнителе",
  ratingLabel = "Оцените работу исполнителя",
  commentPlaceholder = "Опишите качество работы, соблюдение сроков и коммуникацию",
  rating,
  comment,
  isSubmitting,
  onClose,
  onRatingChange,
  onCommentChange,
  onSubmit,
}: Props) {
  return (
    <Modal open={isOpen} onClose={onClose} size="md" isBusy={isSubmitting} ariaLabelledBy="add-review-title">
      <div className={s.titleRow}>
        <h2 id="add-review-title" className={s.title}>{title}</h2>
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
        <span className={s.sectionTitle}>{ratingLabel}</span>

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
          placeholder={commentPlaceholder}
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
    </Modal>
  );
}
