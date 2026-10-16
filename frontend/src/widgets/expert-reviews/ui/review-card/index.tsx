import cn from "classnames";
import { getOrderDocumentPaths, OrderDocumentsGallery } from "@/entities/order";
import type { ReviewItem } from "@/entities/review";
import { StarIcon } from "@/shared/ui/icons";
import { ListCard } from "@/shared/ui/list-card";
import styles from "./style.module.scss";

/** Отзыв заказчика вместе с условиями заказа. */
interface ReviewCardProps {
  review: ReviewItem;
}

/** Показывает оценку, комментарий, требования, сроки и документы заказа. */
export function ReviewCard({ review }: ReviewCardProps) {
  const date = new Date(review.created_at).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const hasDocuments = getOrderDocumentPaths(review.order_documents).length > 0;
  const terms = [
    {
      label: "Начальная максимальная цена",
      value: review.order_sum,
      valueAccent: true,
    },
    {
      label: "Цена исполнителя",
      value: review.expert_sum,
    },
    {
      label: "Срок начала выполнения работ исполнителя",
      value: review.expert_start_date,
    },
    {
      label: "Срок окончания выполнения работ исполнителя",
      value: review.expert_deadline,
    },
    {
      label: "Срок начала выполнения работ",
      value: review.order_start_date,
    },
    {
      label: "Срок окончания выполнения работ",
      value: review.order_deadline,
    },
  ];

  return (
    <ListCard
      meta={`Отзыв от ${date}`}
      titleLabel="Название заказа:"
      title={review.order_title || "—"}
      bottomLeftLabel="Организатор:"
      bottomLeftValue={review.company_name || "—"}
      rightItems={terms.filter((term) => term.value)}
      leftExtra={
        <>
          <div className={styles.ratingBlock}>
            <span className={styles.label}>Оценка:</span>
            <div
              className={styles.ratingRow}
              role="img"
              aria-label={`Оценка ${review.rating} из 5`}
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  filled={star <= review.rating}
                  width={20}
                  height={20}
                />
              ))}
            </div>
          </div>
          {review.comment && (
            <div className={styles.commentBlock}>
              <span className={styles.label}>Отзыв:</span>
              <p className={styles.quote}>
                <span className={styles.quoteMark}>&ldquo;</span>
                {review.comment}
                <span className={styles.quoteMark}>&rdquo;</span>
              </p>
            </div>
          )}
          {review.badges.length > 0 && (
            <div className={styles.requirements}>
              <span className={styles.label}>Требования к исполнителю</span>
              <div className={styles.badges}>
                {review.badges.map((badge) => (
                  <span
                    key={badge.text}
                    className={cn(styles.badge, styles[badge.variant])}
                  >
                    {badge.text}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      }
      details={
        hasDocuments ? (
          <OrderDocumentsGallery documents={review.order_documents} />
        ) : undefined
      }
    />
  );
}
