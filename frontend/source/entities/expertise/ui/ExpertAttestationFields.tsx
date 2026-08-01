"use client";

import { CertificateBuilder } from "./CertificateBuilder";
import type { ExpertCertificate } from "../model/data";
import s from "./ExpertAttestationFields.module.scss";

interface Props {
  certificates: ExpertCertificate[];
  onChangeCertificates: (value: ExpertCertificate[]) => void;
}

export function ExpertAttestationFields({ certificates, onChangeCertificates }: Props) {
  return (
    <div className={s.fields}>
      <div className={s.section}>
        <span className={s.sectionLabel}>Удостоверения</span>
        <span className={s.sectionHint}>
          Добавьте свои удостоверения — область аттестации, объект экспертизы и категорию
        </span>
        <CertificateBuilder value={certificates} onChange={onChangeCertificates} />
      </div>
    </div>
  );
}
