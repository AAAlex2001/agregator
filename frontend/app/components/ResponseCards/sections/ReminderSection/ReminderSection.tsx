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
  if (!reminderText || !reminderDays) return null;

  return (
    <div className={styles.reminderRow}>
      <span className={styles.reminderText}>{reminderText}</span>
      <span className={styles.reminderDays}>{reminderDays}</span>
    </div>
  );
};

export default ReminderSection;
