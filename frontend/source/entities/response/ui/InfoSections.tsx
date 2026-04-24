import s from "./InfoSections.module.scss";

interface TermsProps {
  deadlineLabel?: string;
  deadline: string;
  costLabel?: string;
  cost: string;
}

export function ExpertTerms({ deadlineLabel = "Ваши сроки:", deadline, costLabel = "Ваша оценка стоимости работ:", cost }: TermsProps) {
  return (
    <div className={s.termsRow}>
      <div className={s.termItem}>
        <span className={s.termLabel}>{deadlineLabel}</span>
        <span className={s.termValue}>{deadline}</span>
      </div>
      <div className={s.termCost}>
        <span className={s.termLabel}>{costLabel}</span>
        <span className={s.termValue}>{cost}</span>
      </div>
    </div>
  );
}

export function CommentSection({ title, text }: { title: string; text: string }) {
  return (
    <div className={s.commentRow}>
      <span className={s.commentTitle}>{title}</span>
      <span className={s.commentText}>{text}</span>
    </div>
  );
}

export function ReminderSection({ text }: { text: string }) {
  return (
    <div className={s.reminderRow}>
      <span className={s.reminderText}>{text}</span>
    </div>
  );
}
