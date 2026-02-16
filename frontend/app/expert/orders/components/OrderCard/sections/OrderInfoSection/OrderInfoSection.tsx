import styles from "./orderInfoSection.module.scss";

interface OrderInfoSectionProps {
  title: string;
  customer: string;
}

export default function OrderInfoSection({ title, customer }: OrderInfoSectionProps) {
  return (
    <div className={styles.orderInfo}>
      <p className={styles.title}>{title}</p>
      <p className={styles.customer}>{customer}</p>
    </div>
  );
}
