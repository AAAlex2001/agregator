"use client";

import Link from "next/link";
import Button from "@/source/shared/ui/Button";
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

function Stars({ rating }: { rating: number | null }) {
  const filledCount = rating !== null ? Math.round(rating) : 0;
  return (
    <span className={s.stars} aria-hidden="true">
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon key={index} filled={index < filledCount} width={16} height={16} />
      ))}
    </span>
  );
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
      <div className={s.body}>
        <div className={s.left}>
          <div className={s.header}>
            <UserAvatar src={avatarUrl} alt={`Фото ${fullName}`} className={s.avatar} />
            <div className={s.headerText}>
              <h3 className={s.name}>{fullName}</h3>
              {joinedDisplay && (
                <span className={s.joined}>На платформе с {joinedDisplay}</span>
              )}
            </div>
          </div>

          <dl className={s.stats}>
            <div className={s.statRow}>
              <dt className={s.statLabel}>Рейтинг:</dt>
              <dd className={s.statValue}>
                <Stars rating={rating} />
                <span className={s.statNumber}>{ratingFormatted}</span>
              </dd>
            </div>
            <div className={s.statRow}>
              <dt className={s.statLabel}>Количество заказов:</dt>
              <dd className={s.statValue}>
                <span className={s.statNumber}>
                  {completedOrdersCount} {pluralOrders(completedOrdersCount)}
                </span>
              </dd>
            </div>
            <div className={s.statRow}>
              <dt className={s.statLabel}>Количество отзывов:</dt>
              <dd className={s.statValue}>
                {reviewCount > 0 ? (
                  <Link href={`/expert/reviews/${publicId}`} className={s.statLink}>
                    {reviewCount} {pluralReviews(reviewCount)}
                  </Link>
                ) : (
                  <span className={s.statNumber}>0 отзывов</span>
                )}
              </dd>
            </div>
          </dl>

          <div className={s.actions}>
            <Button
              variant="secondary"
              size="sm"
              href={`/experts/${publicId}/orders`}
            >
              История заказов
            </Button>
          </div>
        </div>

        <div className={s.right}>
          <span className={s.rightLabel}>Последний выполненный заказ</span>
          {lastOrder ? (
            <div className={s.lastOrder}>
              <span className={s.lastOrderMeta}>№ {lastOrder.id}</span>
              <h4 className={s.lastOrderTitle}>{lastOrder.title || "—"}</h4>
              <div className={s.lastOrderGrid}>
                <div className={s.lastOrderItem}>
                  <span className={s.lastOrderItemLabel}>Заказчик</span>
                  <span className={s.lastOrderItemValue}>{lastOrder.customer || "—"}</span>
                </div>
                <div className={s.lastOrderItem}>
                  <span className={s.lastOrderItemLabel}>Сумма</span>
                  <span className={s.lastOrderItemValue}>{lastOrder.sum || "—"}</span>
                </div>
                <div className={s.lastOrderItem}>
                  <span className={s.lastOrderItemLabel}>Срок выполнения до</span>
                  <span className={s.lastOrderItemValue}>{lastOrder.date || "—"}</span>
                </div>
              </div>
            </div>
          ) : (
            <span className={s.lastOrderEmpty}>Заказы ещё не выполнены</span>
          )}
        </div>
      </div>
    </article>
  );
}
