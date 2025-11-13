import styles from "./orders.module.scss";

const orders = [
  {
    title: "Мониторинг продаж",
    description: "Мгновенное обновление отчётов при изменении статусов заказов и оплат.",
    meta: "Для команд продаж",
  },
  {
    title: "Контроль SLA",
    description: "Алерты при задержке отправки, сбоях на складах и нарушениях логистики.",
    meta: "Для операционного отдела",
  },
  {
    title: "Финансовая сверка",
    description: "Сопоставление транзакций, комиссий и возвратов по всем каналам.",
    meta: "Для финансовой службы",
  },
];

const Orders = () => {
  return (
    <section className={styles.section} id="orders">
      <header className={styles.header}>
        <h2>Типовые сценарии автоматизации</h2>
        <p>
          Выбирайте готовые пайплайны Agregator или собирайте свои — логику легко менять без
          вмешательства разработчиков.
        </p>
      </header>
      <div className={styles.list}>
        {orders.map((order) => (
          <article className={styles.item} key={order.title}>
            <div className={styles.meta}>{order.meta}</div>
            <h3>{order.title}</h3>
            <p>{order.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Orders;

