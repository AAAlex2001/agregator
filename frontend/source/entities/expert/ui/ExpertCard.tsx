"use client";

import Link from "next/link";
import Button from "@/source/shared/ui/Button";
import { UserAvatar } from "@/source/shared/ui/UserAvatar";
import { StarIcon } from "@/source/shared/ui/icons";
import s from "./ExpertCard.module.scss";

interface ExpertCardProps {
  publicId: string;
  fullName: string;
  avatarUrl: string | null;
  rating: number | null;
  reviewCount: number;
  completedOrdersCount: number;
  joinedAt: string;
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

function formatJoinedYear(joinedAt: string): string {
  const date = new Date(joinedAt);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("ru-RU", { year: "numeric", month: "long" });
}

export function ExpertCard({
  publicId,
  fullName,
  avatarUrl,
  rating,
  reviewCount,
  completedOrdersCount,
  joinedAt,
}: ExpertCardProps) {
  const ratingFormatted =
    rating !== null
      ? rating.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
      : "—";
  const joinedDisplay = formatJoinedYear(joinedAt);

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

      <dl className={s.stats}>
        <div className={s.statItem}>
          <dt className={s.statLabel}>Рейтинг</dt>
          <dd className={s.statValue}>
            <StarIcon filled width={18} height={18} />
            <span>{ratingFormatted}</span>
          </dd>
        </div>
        <div className={s.statItem}>
          <dt className={s.statLabel}>Отзывы</dt>
          <dd className={s.statValue}>
            {reviewCount > 0 ? (
              <Link href={`/expert/reviews/${publicId}`} className={s.statLink}>
                {reviewCount} {pluralReviews(reviewCount)}
              </Link>
            ) : (
              <span className={s.statMuted}>Пока нет</span>
            )}
          </dd>
        </div>
        <div className={s.statItem}>
          <dt className={s.statLabel}>Выполнено</dt>
          <dd className={s.statValue}>
            {completedOrdersCount > 0 ? (
              <span>
                {completedOrdersCount} {pluralOrders(completedOrdersCount)}
              </span>
            ) : (
              <span className={s.statMuted}>Пока нет</span>
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
    </article>
  );
}
