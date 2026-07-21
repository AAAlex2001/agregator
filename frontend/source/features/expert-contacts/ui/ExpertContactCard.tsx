import type { ExpertContactCardData } from "@/source/entities/expert-contact";
import { Button } from "@/source/shared/ui";
import { EmailIcon, LockIcon, PhoneIcon, StarIcon } from "@/source/shared/ui/icons";
import { certificateLabel, contactDealStatusLabel } from "../lib/formatters";
import s from "./ExpertContacts.module.scss";

interface ExpertContactCardProps {
  expert: ExpertContactCardData;
  busy: boolean;
  onOpen: () => void;
}

export function ExpertContactCard({ expert, busy, onOpen }: ExpertContactCardProps) {
  const initials = expert.name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <article className={s.expertCard}>
      <header className={s.expertHead}>
        {expert.avatar_url ? (
          <img className={s.avatar} src={expert.avatar_url} alt="" />
        ) : (
          <span className={s.avatarFallback} aria-hidden="true">{initials}</span>
        )}
        <div className={s.expertIdentity}>
          <h2>{expert.name}</h2>
          <p>{expert.city || "Регион не указан"}</p>
        </div>
        {expert.rating !== null && (
          <span className={s.rating}><StarIcon /> {expert.rating.toFixed(1)}</span>
        )}
      </header>

      <div className={s.certificates}>
        {expert.certificates.slice(0, 6).map((certificate, index) => (
          <span key={`${certificateLabel(certificate)}-${index}`}>
            {certificateLabel(certificate)}
          </span>
        ))}
        {expert.certificates.length === 0 && <span>Области аттестации не указаны</span>}
      </div>

      <div className={s.contactRows}>
        <div><PhoneIcon /><span>{expert.phone || expert.masked_phone || "Телефон не указан"}</span></div>
        <div><EmailIcon /><span>{expert.email || expert.masked_email || "Email не указан"}</span></div>
      </div>

      <footer className={s.cardFooter}>
        {expert.is_mine ? (
          <span className={s.ownLabel}>Ваша карточка</span>
        ) : expert.deal_status ? (
          <>
            <span className={s.dealStatus}>{contactDealStatusLabel(expert.deal_status)}</span>
            <Button variant="outlineOrange" size="sm" onClick={onOpen} isLoading={busy}>
              Открыть сделку
            </Button>
          </>
        ) : expert.sales_enabled ? (
          <>
            <strong>{expert.price_rubles?.toLocaleString("ru-RU")} ₽</strong>
            <Button variant="primary" size="sm" onClick={onOpen} isLoading={busy}>
              <LockIcon /> Получить контакты
            </Button>
          </>
        ) : (
          <span className={s.unavailable}>Эксперт пока не открыл доступ к контактам</span>
        )}
      </footer>
    </article>
  );
}
