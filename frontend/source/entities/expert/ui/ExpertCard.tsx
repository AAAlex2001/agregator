"use client";

import Link from "next/link";
import Button from "@/source/shared/ui/Button";
import { UserAvatar } from "@/source/shared/ui/UserAvatar";
import { StarIcon } from "@/source/shared/ui/icons";
import { DocumentsGallery, countDocuments } from "@/source/entities/order";
import { TechSpecFiles } from "@/source/entities/response";
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
        <StarIcon key={index} filled={index < filledCount} width={18} height={18} />
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
  const hasDocuments = lastOrder ? countDocuments(lastOrder.documents) > 0 : false;
  const hasExecutorFiles = lastOrder ? lastOrder.executorFiles.length > 0 : false;

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

        {lastOrder ? (
          <>
            <div className={s.center}>
              <span className={s.centerLabel}>Последний выполненный заказ</span>
              <span className={s.centerMeta}>№ {lastOrder.id}</span>
              <div className={s.field}>
                <span className={s.fieldLabel}>Название заказа:</span>
                <h4 className={s.fieldTitle}>{lastOrder.title || "—"}</h4>
              </div>
              <div className={s.field}>
                <span className={s.fieldLabel}>Организатор:</span>
                <span className={s.fieldValue}>{lastOrder.customer || "—"}</span>
              </div>
              <div className={s.field}>
                <span className={s.fieldLabel}>ИНН:</span>
                <span className={s.fieldValue}>{lastOrder.customerInn || "—"}</span>
              </div>
              {lastOrder.executorComment && (
                <div className={s.field}>
                  <span className={s.fieldLabel}>Комментарий исполнителя:</span>
                  <span className={s.fieldValue}>{lastOrder.executorComment}</span>
                </div>
              )}
              {(hasDocuments || hasExecutorFiles) && (
                <div className={s.filesArea}>
                  {hasDocuments && (
                    <DocumentsGallery documents={lastOrder.documents} heading="Документы заказчика" />
                  )}
                  {hasExecutorFiles && (
                    <TechSpecFiles title="Файлы исполнителя:" files={lastOrder.executorFiles} />
                  )}
                </div>
              )}
            </div>

            <div className={s.side}>
              <div className={s.field}>
                <span className={s.fieldLabel}>Начальная максимальная цена</span>
                <span className={s.fieldAccent}>{lastOrder.sum || "Не определено"}</span>
              </div>
              {lastOrder.executorProposedSum && (
                <div className={s.field}>
                  <span className={s.fieldLabel}>Цена эксперта</span>
                  <span className={s.fieldValue}>{lastOrder.executorProposedSum}</span>
                </div>
              )}
              {lastOrder.executorProposedStartDate && (
                <div className={s.field}>
                  <span className={s.fieldLabel}>Срок начала эксперта</span>
                  <span className={s.fieldValue}>{lastOrder.executorProposedStartDate}</span>
                </div>
              )}
              {lastOrder.executorProposedDeadline && (
                <div className={s.field}>
                  <span className={s.fieldLabel}>Срок окончания эксперта</span>
                  <span className={s.fieldValue}>{lastOrder.executorProposedDeadline}</span>
                </div>
              )}
              {lastOrder.startDate && (
                <div className={s.field}>
                  <span className={s.fieldLabel}>Срок начала работ</span>
                  <span className={s.fieldValue}>{lastOrder.startDate}</span>
                </div>
              )}
              <div className={s.field}>
                <span className={s.fieldLabel}>Срок выполнения до</span>
                <span className={s.fieldValue}>{lastOrder.date || "—"}</span>
              </div>
            </div>
          </>
        ) : (
          <div className={s.center}>
            <span className={s.centerLabel}>Последний выполненный заказ</span>
            <span className={s.lastOrderEmpty}>Заказы ещё не выполнены</span>
          </div>
        )}
      </div>
    </article>
  );
}
