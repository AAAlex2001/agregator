"use client";

import type { LaborListingData } from "@/source/entities/labor";
import type { SessionRole } from "@/source/features/session";
import { Button } from "@/source/shared/ui";
import {
  formatLaborCertificate,
  formatLaborDate,
} from "../lib/formatters";
import s from "./LaborListingCard.module.scss";

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
