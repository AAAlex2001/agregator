"use client";

import { ListCard } from "@/source/shared/ui/ListCard";
import { StarIcon } from "@/source/shared/ui/icons";
import {
  DocumentsGallery,
  RequirementsBadges,
  countDocuments,
  emptyDocuments,
  type OrderDocuments,
} from "@/source/entities/order";
import s from "./ReviewCard.module.scss";

export interface ReviewCardProps {
  customer: string;
  order: string;
  orderSum: string;
  orderStartDate?: string;
  orderDeadline: string;
  expertStartDate?: string;
  expertDeadline: string;
  expertSum: string;
  documents?: OrderDocuments;
  badges?: Array<{
    text: string;
    variant: "blue" | "green" | "gray" | "orange" | "brown" | "purple";
  }>;
  rating: number;
  date: string;
  comment: string;
}

export function ReviewCard({
  customer,
  order,
  orderSum,
  orderStartDate,
  orderDeadline,
  expertStartDate,
  expertDeadline,
  expertSum,
  documents = emptyDocuments(),
  badges = [],
  rating,
  date,
  comment,
}: ReviewCardProps) {
  const rightItems = [
    ...(orderSum
      ? [{ label: "Начальная максимальная цена", value: orderSum, valueAccent: true }]
      : []),
    ...(expertSum ? [{ label: "Цена эксперта", value: expertSum }] : []),
    ...(expertStartDate ? [{ label: "Срок начала эксперта", value: expertStartDate }] : []),
    ...(expertDeadline ? [{ label: "Срок окончания эксперта", value: expertDeadline }] : []),
    ...(orderStartDate ? [{ label: "Срок начала работ", value: orderStartDate }] : []),
    ...(orderDeadline ? [{ label: "Срок выполнения до", value: orderDeadline }] : []),
  ];

  const hasDetails = countDocuments(documents) > 0;

  return (
    <ListCard
      meta={`Отзыв от ${date}`}
      titleLabel="Название заказа:"
      title={order || "—"}
      bottomLeftLabel="Организатор:"
      bottomLeftValue={customer || "—"}
      rightItems={rightItems}
      leftExtra={
        <>
          <div className={s.ratingBlock}>
            <span className={s.ratingLabel}>Оценка:</span>
            <div className={s.ratingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon key={star} filled={star <= rating} width={20} height={20} />
              ))}
            </div>
          </div>
          {comment && (
            <div className={s.commentBlock}>
              <span className={s.commentLabel}>Отзыв:</span>
              <p className={s.quote}>
                <span className={s.quoteMark}>&ldquo;</span>
                {comment}
                <span className={s.quoteMark}>&rdquo;</span>
              </p>
            </div>
          )}
          <RequirementsBadges badges={badges} />
        </>
      }
      details={hasDetails ? <DocumentsGallery documents={documents} /> : undefined}
    />
  );
}
