"use client";

import { useState } from "react";
import { ATTESTATION_AREAS } from "../../config/attestation-areas";
import { AttestationAreaDetails } from "../attestation-area-details";
import { AttestationAreaOption } from "../attestation-area-option";
import styles from "./style.module.scss";

/** Выбор одного кода требований из области аттестации и объекта экспертизы. */
interface ExpertiseCodeSelectorProps {
  onSelect: (code: string) => void;
}

/** Раскрывает область аттестации и предлагает допустимые объекты экспертизы. */
export function ExpertiseCodeSelector({ onSelect }: ExpertiseCodeSelectorProps) {
  const [activeArea, setActiveArea] = useState<string | null>(null);
  const selectedArea = ATTESTATION_AREAS.find((area) => area.value === activeArea);

  /** Открывает описание области и доступные для неё коды. */
  function openArea(value: string) {
    setActiveArea(value);
  }

  /** Скрывает подсказку только у области, которую покинул указатель. */
  function closeArea(value: string) {
    setActiveArea((current) => current === value ? null : current);
  }

  return (
    <section
      className={styles.expertiseColumn}
      aria-label="Экспертиза"
    >
      <span className={styles.srOnly}>Экспертиза</span>
      <div className={styles.opoGrid}>
        {ATTESTATION_AREAS.map((area) => (
          <AttestationAreaOption
            key={area.value}
            area={area}
            isActive={activeArea === area.value}
            onOpen={openArea}
            onClose={closeArea}
            onSelect={onSelect}
          />
        ))}
      </div>

      {selectedArea && (
        <div className={styles.mobileExpertiseDetail}>
          <AttestationAreaDetails
            area={selectedArea}
            variant="mobile"
            onSelect={onSelect}
          />
        </div>
      )}
    </section>
  );
}
