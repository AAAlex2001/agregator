"use client";

import type { LaborListingData } from "@/source/entities/labor";
import type { SessionRole } from "@/source/features/session";
import { Button } from "@/source/shared/ui";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { SITE_URL } from "@/source/shared/api/config";
import {
  formatLaborCertificate,
  formatLaborDate,
} from "../lib/formatters";
import s from "./LaborListingCard.module.scss";

function copyWithFallback(value: string): void {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

interface LaborListingCardProps {
  item: LaborListingData;
  role: SessionRole | null;
  busy: boolean;
  onContact: () => void;
  onClose: () => void;
}

export function LaborListingCard({
  item,
  role,
  busy,
  onContact,
  onClose,
}: LaborListingCardProps) {
  const { showSuccess, showError } = useNotifications();

  const handleShare = async () => {
    const url = `${SITE_URL}/labor/listing/${item.public_id}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        copyWithFallback(url);
      }
      showSuccess("Ссылка на заявку скопирована");
    } catch {
      showError("Не удалось скопировать ссылку");
    }
  };

  const canContact =
    !item.is_mine &&
    ((item.kind === "EXPERT_AVAILABLE" &&
      role === "LICENSE_HOLDER") ||
      (item.kind === "EXPERT_WANTED" && role === "EXPERT"));
  const employmentTerm =
    item.employment_term === "PERMANENT"
      ? "Постоянная работа"
      : `Срочный договор: ${item.fixed_term}`;

  return (
    <article className={s.card}>
      <div className={s.header}>
        <div>
          <h2 className={s.title}>{item.owner_name}</h2>
          <p className={s.kind}>
            {item.kind === "EXPERT_AVAILABLE"
              ? "Эксперт готов к трудоустройству"
              : "Организация ищет эксперта"}
          </p>
        </div>
        <span className={s.region}>{item.region}</span>
      </div>

      {item.other_profession ? (
        <div className={s.otherProfession}>
          <span className={s.otherProfessionLabel}>Иная профессия</span>
          <p className={s.otherProfessionText}>{item.other_profession}</p>
        </div>
      ) : (
        <div className={s.certificates}>
          {item.certificates.map((certificate, index) => (
            <span
              key={`${certificate.area}-${certificate.object ?? ""}-${certificate.category ?? ""}-${index}`}
              className={s.certificate}
            >
              {formatLaborCertificate(certificate)}
            </span>
          ))}
        </div>
      )}

      <dl className={s.meta}>
        <MetaItem label="Формат" value={employmentTerm} />

        {item.start_date && (
          <MetaItem
            label="Приступить"
            value={formatLaborDate(item.start_date)}
          />
        )}

        {item.employment_type && (
          <MetaItem
            label="Место работы"
            value={
              item.employment_type === "PRIMARY"
                ? "Основное"
                : "Совместительство"
            }
          />
        )}

        {item.current_job_status && (
          <MetaItem
            label="Сейчас"
            value={
              item.current_job_status === "NONE"
                ? "Основное место работы отсутствует"
                : "Работает, потребуется увольнение"
            }
          />
        )}
      </dl>

      <div className={s.actions}>
        <Button variant="outline" size="sm" onClick={handleShare}>
          Поделиться
        </Button>

        {canContact && (
          <Button
            variant="chat"
            size="sm"
            onClick={onContact}
            isLoading={busy}
          >
            {item.kind === "EXPERT_AVAILABLE"
              ? "Пригласить в чат"
              : "Откликнуться"}
          </Button>
        )}

        {item.is_mine && (
          <Button
            variant="transparent"
            size="sm"
            onClick={onClose}
            disabled={busy}
          >
            Закрыть заявку
          </Button>
        )}
      </div>
    </article>
  );
}

function MetaItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
