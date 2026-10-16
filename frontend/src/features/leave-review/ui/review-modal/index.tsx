"use client";

import { useId } from "react";
import { Button } from "@/shared/ui/button";
import { CardInput } from "@/shared/ui/card-input";
import { Modal } from "@/shared/ui/modal";
import type { LeaveReviewOptions } from "../../model/types";
import { useLeaveReview } from "../../model/use-leave-review";
import { RatingStar } from "../rating-star";
import styles from "./style.module.scss";

/** Участники и подписи диалога вместе с публикацией отзыва. */
interface ReviewModalProps extends LeaveReviewOptions {
  customerName: string;
  orderTitle: string;
  expertName: string;
  title: string;
  ratingLabel: string;
  commentPlaceholder: string;
}

/** Собирает оценку и комментарий; родитель монтирует отдельную форму для каждой цели. */
export function ReviewModal({
  customerName,
  orderTitle,
  expertName,
  title,
  ratingLabel,
  commentPlaceholder,
  publish,
  successMessage,
  onPublished,
  onClose,
}: ReviewModalProps) {
  const titleId = useId();
  const form = useLeaveReview({
    publish,
    successMessage,
    onPublished,
    onClose,
  });

  return (
    <Modal
      open
      onClose={form.close}
      size="md"
      isBusy={form.isSubmitting}
      ariaLabelledBy={titleId}
    >
      <div className={styles.titleRow}>
        <h2
          id={titleId}
          className={styles.title}
        >
          {title}
        </h2>
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
        <span className={styles.sectionTitle}>{ratingLabel}</span>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((value) => (
            <RatingStar
              key={value}
              value={value}
              active={value <= form.rating}
              onChange={form.changeRating}
            />
          ))}
        </div>
      </div>

      <div className={styles.commentWrap}>
        <span className={styles.commentLabel}>Комментарий</span>
        <CardInput
          value={form.comment}
          onChange={form.changeComment}
          multiline
          rows={4}
          placeholder={commentPlaceholder}
          className={styles.commentInput}
        />
      </div>

      <div className={styles.actions}>
        <Button
          variant="outline"
          size="sm"
          onClick={form.close}
          disabled={form.isSubmitting}
          className={styles.cancelButton}
        >
          Отменить
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={form.submit}
          disabled={form.isSubmitting || form.rating < 1}
          isLoading={form.isSubmitting}
          className={styles.submitButton}
        >
          Опубликовать отзыв
        </Button>
      </div>
    </Modal>
  );
}
