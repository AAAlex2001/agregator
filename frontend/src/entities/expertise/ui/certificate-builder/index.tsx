"use client";

import cn from "classnames";
import { Button } from "@/shared/ui/button";
import { CalendarInput } from "@/shared/ui/calendar-input";
import {
  CERTIFICATE_CATEGORIES,
  EXPERTISE_TYPES,
} from "../../config/attestation-areas";
import type { ExpertCertificate } from "../../model/types";
import { useCertificateBuilder } from "../../model/use-certificate-builder";
import { AttestationAreaField } from "../attestation-area-field";
import { CertificateList } from "../certificate-list";
import { TypeBadge } from "../type-badge";
import styles from "./style.module.scss";

/** Удостоверения эксперта и действие сохранения обновлённого списка. */
interface CertificateBuilderProps {
  value: ExpertCertificate[];
  onChange: (certificates: ExpertCertificate[]) => void;
}

/** Собирает удостоверение из области, объекта, категории и срока действия. */
export function CertificateBuilder({
  value,
  onChange,
}: CertificateBuilderProps) {
  const form = useCertificateBuilder(value, onChange);

  return (
    <div className={styles.builder}>
      <AttestationAreaField
        value={form.fields.area}
        onChange={form.changeArea}
      />

      <div className={styles.group}>
        <span className={styles.groupLabel}>Объект экспертизы</span>
        <div className={styles.badges}>
          {EXPERTISE_TYPES.map((type) => (
            <TypeBadge
              key={type}
              type={type}
              active={form.fields.object === type}
              onClick={() => form.changeObject(type)}
            />
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.groupLabel}>Категория</span>
        <div className={styles.options}>
          {CERTIFICATE_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              className={cn(
                styles.option,
                { [styles.optionActive]: form.fields.category === category },
              )}
              onClick={() => form.changeCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.group}>
        <span className={styles.groupLabel}>
          Срок действия удостоверения
        </span>
        <CalendarInput
          value={form.fields.expiresAt}
          onChange={form.changeExpiry}
          placeholder="Выберите дату"
        />
      </div>

      <Button
        type="button"
        variant="outlineOrange"
        size="sm"
        onClick={form.add}
        disabled={!form.canAdd}
      >
        Добавить удостоверение
      </Button>

      <CertificateList
        certificates={value}
        onRemove={form.remove}
      />
    </div>
  );
}
