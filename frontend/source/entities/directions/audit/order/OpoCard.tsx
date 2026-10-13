"use client";

import { RemoveButton } from "../../shared";
import type { AuditOpoItem } from "./types";
import { OpoItemFields } from "./OpoItemFields";
import s from "./OpoCard.module.scss";

interface OpoCardProps {
  number: number;
  value: AuditOpoItem;
  canRemove: boolean;
  onChange: (value: AuditOpoItem) => void;
  onRemove: () => void;
}

/** Один объект в списке выборочного аудита: номер, поля объекта и кнопка «убрать». */
export function OpoCard({ number, value, canRemove, onChange, onRemove }: OpoCardProps) {
  return (
    <div className={s.card}>
      <div className={s.head}>
        <span className={s.title}>ОПО №{number}</span>
        {canRemove && <RemoveButton label="Убрать объект" onClick={onRemove} />}
      </div>
      <OpoItemFields value={value} onChange={onChange} />
    </div>
  );
}
