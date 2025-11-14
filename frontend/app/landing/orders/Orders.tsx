import styles from "./orders.module.scss";

const orders = [
  {
    title: "Экспертиза проекта модернизации ",
      price: "1 200 000 ₽",
    description: "установки ЭЛОУ-АВТ. Требуется: Эксперт Э7 ОБ",
  },
  {
    title: "Проект вскрыши карьера для золоторудного месторождения",
      price: "850 000 ₽",
    description: "Объём вскрыши: 1.8 млн куб. м.",
  },
  {
    title: "Расчёт устойчивости борта карьера глубиной 150 м",
    price: "2 200 000 ₽",
    description: "Требуется: Эксперт Э2 ЗС",
  },

    {
    title: "Расчёт устойчивости борта карьера глубиной 150 м",
    price: "2 200 000 ₽",
    description: "Требуется: Эксперт Э2 ЗС",
  },
    {
    title: "Расчёт устойчивости борта карьера глубиной 150 м",
    price: "2 200 000 ₽",
    description: "Требуется: Эксперт Э2 ЗС",
  },
];

const Orders = () => {
  return (
    <section className={styles.section} id="orders">
        <div className={styles.content}>
      <header className={styles.header}>
        <h1>Реальные заказы с платформы</h1>
        <p>
          Актуальные проекты от предприятий горнодобывающий отрасли. Находите подходящие и откликайтесь напрямую
        </p>
      </header>
      <div className={styles.list}>
        {orders.map((order) => (
          <article className={styles.item} key={order.title}>
              <div className={styles.headerItem}>
            <h2>{order.title}</h2>
                  <span>{order.price}</span>
                  </div>
            <p>{order.description}</p>
          </article>
        ))}
      </div>
            </div>
    </section>
  );
};

export default Orders;

