"use client";

import styles from "./orderCard.module.scss";

export interface Badge {
  text: string;
  variant: "blue" | "green";
}

export interface OrderCardProps {
  badges: Badge[];
  title: string;
  customer: string;
  date: string;
  sum: string;
  onClick?: () => void;
}

const OrderCard = ({ badges, title, customer, date, sum, onClick }: OrderCardProps) => {
  return (
    <article className={styles.card} onClick={onClick}>
      <div className={styles.top}>
        <div className={styles.badges}>
          {badges.map((badge, index) => (
            <span
              key={index}
              className={`${styles.badge} ${styles[badge.variant]}`}
            >
              {badge.text}
            </span>
          ))}
        </div>
        <div className={styles.orderInfo}>
          <p className={styles.title}>{title}</p>
          <p className={styles.customer}>{customer}</p>
        </div>
      </div>
      <div className={styles.bottom}>
        <span className={styles.date}>{date}</span>
        <span className={styles.sum}>{sum}</span>
      </div>
    </article>
  );
};

export default OrderCard;
