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

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) {
    return null;
  }

  return (
    <div className={s.field}>
      <span className={s.fieldLabel}>{label}</span>
      <span className={s.fieldValue}>{value}</span>
    </div>
  );
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
  return (
    <article className={s.card}>
      <details className={s.orderDetails} open>
        <summary className={s.summary}>
          <span className={s.summaryLabel}>От кого:</span>
          <span className={s.summaryValue}>{customer}</span>
          <ChevronIcon className={s.chevron} />
        </summary>

        <div className={s.dropdown}>
          <Field label="Заказ:" value={order} />
          {badges.length > 0 && (
            <div className={s.field}>
              <span className={s.fieldLabel}>Бейджи:</span>
              <div className={s.badges}>
                {badges.map((badge, index) => (
                  <span key={`${badge.text}-${index}`} className={`${s.badge} ${s[badge.variant]}`}>
                    {badge.text}
                  </span>
                ))}
              </div>
            </div>
          )}
          <Field label="Сумма заказа:" value={orderSum} />
          <Field label="Срок заказа:" value={orderDeadline} />
          <Field label="Срок эксперта:" value={expertDeadline} />
          <Field label="Сумма от эксперта:" value={expertSum} />
          <FileGallery files={technicalFiles} label="Техническое задание:" hideWhenEmpty />
        </div>
      </details>

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