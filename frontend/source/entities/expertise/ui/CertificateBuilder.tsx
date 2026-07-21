"use client";

import { useState } from "react";
import Button from "@/source/shared/ui/Button";
import { CalendarInput } from "@/source/shared/ui/CalendarInput";
import {
  AREA_OPTIONS,
  CATEGORY_OPTIONS,
  TYPES,
  type ExpertCertificate,
  type ExpertiseType,
} from "../model/data";
import { TypeBadge } from "./TypeBadge";
import s from "./CertificateBuilder.module.scss";

interface Props {
  value: ExpertCertificate[];
  onChange: (next: ExpertCertificate[]) => void;
}

const sameCert = (a: ExpertCertificate, b: ExpertCertificate) =>
  a.area === b.area &&
  a.object === b.object &&
  a.category === b.category &&
  a.expires_at === b.expires_at;

export function CertificateBuilder({ value, onChange }: Props) {
  const [area, setArea] = useState("");
  const [object, setObject] = useState("");
  const [category, setCategory] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const canAdd = Boolean(area && object && category && expiresAt);

  const add = () => {
    if (!canAdd) return;
    const draft: ExpertCertificate = { area, object, category, expires_at: expiresAt.slice(0, 10) };
    if (value.some((cert) => sameCert(cert, draft))) return;
    onChange([...value, draft]);
    setArea("");
    setObject("");
    setCategory("");
    setExpiresAt("");
  };

  const remove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={s.builder}>
      <div className={s.group}>
        <span className={s.groupLabel}>Область аттестации</span>
        <div className={s.options}>
          {AREA_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              title={opt.name}
              className={`${s.option} ${area === opt.value ? s.optionActive : ""}`}
              onClick={() => setArea(opt.value)}
            >
              {opt.value}
            </button>
          ))}
        </div>
      </div>

      <div className={s.group}>
        <span className={s.groupLabel}>Объект экспертизы</span>
        <div className={s.badges}>
          {TYPES.map((type) => (
            <TypeBadge
              key={type}
              type={type}
              active={object === type}
              onClick={() => setObject(type)}
            />
          ))}
        </div>
      </div>

      <div className={s.group}>
        <span className={s.groupLabel}>Категория</span>
        <div className={s.options}>
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`${s.option} ${category === cat ? s.optionActive : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className={s.group}>
        <span className={s.groupLabel}>Срок действия удостоверения</span>
        <CalendarInput value={expiresAt} onChange={setExpiresAt} placeholder="Выберите дату" />
      </div>

      <Button type="button" variant="outlineOrange" size="sm" onClick={add} disabled={!canAdd}>
        Добавить удостоверение
      </Button>

      {value.length > 0 && (
        <ul className={s.certList}>
          {value.map((cert, index) => (
            <li key={`${cert.area}-${cert.object}-${cert.category}-${cert.expires_at ?? ""}`} className={s.certRow}>
              <span className={s.certContent}>
                <span className={s.certArea}>{cert.area}</span>
                <TypeBadge type={cert.object as ExpertiseType} active />
                <span className={s.certCat}>· {cert.category} кат.</span>
                {cert.expires_at && <span className={s.certExpiry}>· до {cert.expires_at}</span>}
              </span>
              <button
                type="button"
                className={s.certRemove}
                onClick={() => remove(index)}
                aria-label="Удалить удостоверение"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
