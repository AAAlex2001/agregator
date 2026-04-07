"use client";

import styles from "./expertTerms.module.scss";

interface ExpertTermsProps {
  deadline: string;
  costEstimate: string;
}

const ExpertTerms = ({ deadline, costEstimate }: ExpertTermsProps) => (
  <div className={styles.termsRow}>
    <div className={styles.termItem}>
      <span className={styles.termLabel}>Ваши сроки:</span>
      <span className={styles.termValue}>{deadline}</span>
    </div>
    <div className={styles.costItem}>
      <span className={styles.termLabel}>Ваша оценка стоимости работ:</span>
      <span className={styles.termValue}>{costEstimate}</span>
    </div>
  </div>
);

export default ExpertTerms;
