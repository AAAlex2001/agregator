"use client";

import { ListCard } from "@/source/shared/ui/ListCard";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import { StarIcon } from "@/source/shared/ui/icons";
import { RequirementsBadges } from "@/source/entities/order";
import s from "./ReviewCard.module.scss";

export interface ReviewCardProps {
  customer: string;
  order: string;
  orderSum: string;
  orderDeadline: string;
  expertDeadline: string;
  expertSum: string;
  technicalFiles?: string[];
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
  orderDeadline,
  expertDeadline,
  expertSum,
  technicalFiles = [],
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
    ...(expertDeadline ? [{ label: "Срок эксперта", value: expertDeadline }] : []),
    ...(orderDeadline ? [{ label: "Срок выполнения до", value: orderDeadline }] : []),
  ];

  const hasDetails = technicalFiles.length > 0;

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
              <span className={s.ratingValue}>{rating} / 5</span>
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
      details={
        hasDetails ? (
          <FileGallery files={technicalFiles} label="Техническое задание:" hideWhenEmpty />
        ) : undefined
      }
    />
  );
}
