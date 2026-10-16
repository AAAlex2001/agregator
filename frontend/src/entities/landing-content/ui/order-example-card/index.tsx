import classNames from "classnames";
import type { LandingOrderExample } from "../../model/types";
import styles from "./style.module.scss";

/** Пример заказа, размещённый редактором на главной странице. */
interface OrderExampleCardProps {
  order: LandingOrderExample;
}

/** Показывает название, цену и описание примера заказа. */
export function OrderExampleCard({ order }: OrderExampleCardProps) {
  return (
    <article className={classNames(styles.card, styles.order)}>
      <div className={styles.header}>
        <h3>{order.title}</h3>
        <span>{order.price}</span>
      </div>
      <p>{order.description}</p>
    </article>
  );
}
