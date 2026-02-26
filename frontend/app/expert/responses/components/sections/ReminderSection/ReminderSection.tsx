"use client";

import styles from "./reminderSection.module.scss";

interface ReminderSectionProps {
  reminderText?: string;
  reminderDays?: string;
}

const ReminderSection = ({
  reminderText,
  reminderDays,
}: ReminderSectionProps) => {
  if (!reminderText) return null;

  return (
    <div className={styles.reminderRow}>
      <span className={styles.reminderText}>{reminderText}</span>
      {reminderDays && <span className={styles.reminderDays}>{reminderDays}</span>}
    </div>
  );
};

export default ReminderSection;
