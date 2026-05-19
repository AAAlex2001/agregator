"use client";

import Link from "next/link";
import Button from "@/source/shared/ui/Button";
import { OrderCard } from "@/source/entities/order";
import { UserAvatar } from "@/source/shared/ui/UserAvatar";
import { StarIcon } from "@/source/shared/ui/icons";
import type { OrderCardData } from "@/source/entities/order";
import s from "./ExpertCard.module.scss";

interface ExpertCardProps {
  publicId: string;
  fullName: string;
  avatarUrl: string | null;
  rating: number | null;
  reviewCount: number;
  completedOrdersCount: number;
  joinedAt: string;
  lastOrder: OrderCardData | null;
}

function pluralReviews(count: number): string {
  const remainder100 = count % 100;
  const remainder10 = count % 10;
  if (remainder100 >= 11 && remainder100 <= 19) return "отзывов";
  if (remainder10 === 1) return "отзыв";
  if (remainder10 >= 2 && remainder10 <= 4) return "отзыва";
  return "отзывов";
}

function pluralOrders(count: number): string {
  const remainder100 = count % 100;
  const remainder10 = count % 10;
  if (remainder100 >= 11 && remainder100 <= 19) return "заказов";
  if (remainder10 === 1) return "заказ";
  if (remainder10 >= 2 && remainder10 <= 4) return "заказа";
  return "заказов";
}

function formatJoinedDate(joinedAt: string): string {
  const date = new Date(joinedAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
}

export function ExpertCard({
  publicId,
  fullName,
  avatarUrl,
  rating,
  reviewCount,
  completedOrdersCount,
  joinedAt,
  lastOrder,
}: ExpertCardProps) {
  const ratingFormatted =
    rating !== null
      ? rating.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
      : "—";
  const joinedDisplay = formatJoinedDate(joinedAt);

  return (
    <article className={s.card}>
      <div className={s.header}>
        <UserAvatar src={avatarUrl} alt={`Фото ${fullName}`} className={s.avatar} />
        <div className={s.headerText}>
          <h3 className={s.name}>{fullName}</h3>
          {joinedDisplay && (
            <span className={s.joined}>На платформе с {joinedDisplay}</span>
          )}
        </div>
      </div>

      <div className={s.stats}>
        <span className={s.statRating}>
          <StarIcon filled width={16} height={16} />
          <span>{ratingFormatted}</span>
        </span>
        <span className={s.dot} aria-hidden="true">·</span>
        <span className={s.statText}>
          {reviewCount > 0 ? (
            <Link href={`/expert/reviews/${publicId}`} className={s.statLink}>
              {reviewCount} {pluralReviews(reviewCount)}
            </Link>
          ) : (
            <span className={s.statMuted}>0 отзывов</span>
          )}
        </span>
        <span className={s.dot} aria-hidden="true">·</span>
        <span className={s.statText}>
          {completedOrdersCount > 0 ? (
            <>
              {completedOrdersCount} {pluralOrders(completedOrdersCount)}
            </>
          ) : (
            <span className={s.statMuted}>0 заказов</span>
          )}
        </span>
      </div>

      {lastOrder && (
        <div className={s.lastOrder}>
          <span className={s.lastOrderLabel}>Последний выполненный заказ</span>
          <OrderCard
            id={lastOrder.id}
            badges={lastOrder.badges}
            title={lastOrder.title}
            customer={lastOrder.customer}
            date={lastOrder.date}
            sum={lastOrder.sum}
            status="ARCHIVED"
          />
        </div>
      )}

      <div className={s.actions}>
        <Button
          variant="secondary"
          size="sm"
          href={`/experts/${publicId}/orders`}
        >
          История заказов
        </Button>
      </div>
    </article>
  );
}
