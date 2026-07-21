import { ExpertCard } from "@/source/entities/expert";
import type { ExpertContactCardData } from "@/source/entities/expert-contact";
import { Button } from "@/source/shared/ui";
import { EmailIcon, LockIcon, PhoneIcon } from "@/source/shared/ui/icons";
import { certificateLabel, contactDealStatusLabel } from "../lib/formatters";
import s from "./ExpertContactCard.module.scss";

interface ExpertContactCardProps {
  expert: ExpertContactCardData;
  busy: boolean;
  onOpen: () => void;
}

export function ExpertContactCard({ expert, busy, onOpen }: ExpertContactCardProps) {
  const contactDetails = (
    <div className={s.contactDetails}>
      <span className={s.cardSectionLabel}>Области аттестации и контакты</span>
      <span className={s.expertCity}>{expert.city || "Регион не указан"}</span>
      <div className={s.certificates}>
        {expert.certificates.slice(0, 8).map((certificate, index) => (
          <span key={`${certificateLabel(certificate)}-${index}`}>
            {certificateLabel(certificate)}
          </span>
        ))}
        {expert.certificates.length === 0 && <span>Области аттестации не указаны</span>}
      </div>
      <div className={s.contactRows}>
        <div>
          <PhoneIcon />
          <span>{expert.phone || expert.masked_phone || "Телефон не указан"}</span>
        </div>
        <div>
          <EmailIcon />
          <span>{expert.email || expert.masked_email || "Email не указан"}</span>
        </div>
      </div>
    </div>
  );

  const contactAction = (
    <div className={s.contactAction}>
      <span className={s.cardSectionLabel}>Доступ к контактам</span>
      {expert.is_mine ? (
        <span className={s.mutedLabel}>Это ваша карточка эксперта</span>
      ) : expert.deal_status ? (
        <>
          <span className={s.dealStatus}>{contactDealStatusLabel(expert.deal_status)}</span>
          <Button variant="outlineOrange" size="sm" onClick={onOpen} isLoading={busy}>
            Открыть сделку
          </Button>
        </>
      ) : expert.sales_enabled ? (
        <>
          <span className={s.priceLabel}>Цена</span>
          <strong className={s.contactPrice}>
            {expert.price_rubles?.toLocaleString("ru-RU")} ₽
          </strong>
          <Button variant="primary" size="sm" onClick={onOpen} isLoading={busy}>
            <LockIcon /> Получить контакты
          </Button>
        </>
      ) : (
        <span className={s.mutedLabel}>Эксперт пока не открыл доступ к контактам</span>
      )}
    </div>
  );

  return (
    <ExpertCard
      publicId={expert.public_id}
      fullName={expert.name}
      avatarUrl={expert.avatar_url}
      rating={expert.rating}
      reviewCount={expert.review_count}
      details={contactDetails}
      aside={contactAction}
    />
  );
}
