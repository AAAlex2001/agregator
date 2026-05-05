"use client";

import { useState } from "react";
import { FileGallery } from "@/source/shared/ui/FileGallery";
import { ChevronIcon, StarIcon } from "@/source/shared/ui/icons";
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
  const [open, setOpen] = useState(false);
  const hasOrderDetails = Boolean(order || badges.length > 0 || orderDeadline || orderSum);
  const hasTerms = Boolean(expertDeadline || expertSum);

  return (
    <article className={s.card}>
      <button
        type="button"
        className={s.header}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
      >
        <span className={s.headerLabel}>От:</span>
        <span className={s.headerValue}>{customer}</span>
        <ChevronIcon className={`${s.chevron} ${open ? s.chevronOpen : ""}`} />
      </button>

      {open && (
        <div className={s.dropdown}>
          {hasOrderDetails && (
            <div className={s.orderSection}>
              {order && (
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Заказ:</span>
                  <span className={s.detailValue}>{order}</span>
                </div>
              )}

              {badges.length > 0 && (
                <div className={s.detailRow}>
                  <span className={s.detailLabel}>Требования к эксперту:</span>
                  <div className={s.badgesWrap}>
                    <div className={s.badges}>
                      {badges.map((badge, index) => (
                        <span key={`${badge.text}-${index}`} className={`${s.badge} ${s[badge.variant]}`}>
                          {badge.text}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {(orderDeadline || orderSum) && (
                <div className={s.termsRow}>
                  {orderDeadline ? (
                    <div className={s.termItem}>
                      <span className={s.termLabel}>Дедлайн:</span>
                      <span className={s.termValue}>{orderDeadline}</span>
                    </div>
                  ) : (
                    <span className={s.termSpacer} />
                  )}

                  {orderSum ? (
                    <div className={s.termCost}>
                      <span className={s.termLabel}>Сумма заказа:</span>
                      <span className={s.termValue}>{orderSum}</span>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          )}

          <div className={s.info}>
            {hasTerms && (
              <div className={s.termsRow}>
                {expertDeadline ? (
                  <div className={s.termItem}>
                    <span className={s.termLabel}>Срок эксперта:</span>
                    <span className={s.termValue}>{expertDeadline}</span>
                  </div>
                ) : (
                  <span className={s.termSpacer} />
                )}

                {expertSum ? (
                  <div className={s.termCost}>
                    <span className={s.termLabel}>Сумма от эксперта:</span>
                    <span className={s.termValue}>{expertSum}</span>
                  </div>
                ) : null}
              </div>
            )}

            <FileGallery files={technicalFiles} label="Техническое задание:" hideWhenEmpty />
          </div>
        </div>
      )}

      <div className={s.ratingDate}>
        <div className={s.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon key={star} filled={star <= rating} width={18} height={18} />
          ))}
        </div>

        <span className={s.date}>{date}</span>
      </div>

      <div className={s.commentBlock}>
        <p className={s.commentText}>{comment}</p>
      </div>
    </article>
  );
}