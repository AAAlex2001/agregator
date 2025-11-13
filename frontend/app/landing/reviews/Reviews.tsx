import styles from "./reviews.module.scss";

const reviews = [
  {
    name: "Анастасия, CPO маркетплейса",
    quote:
      "Agregator сократил время подготовки управленческого отчёта с двух дней до пары часов. Команда теперь работает с данными в реальном времени.",
  },
  {
    name: "Игорь, операционный директор сети магазинов",
    quote:
      "Мы увидели узкие места в поставках и быстрее реагируем на отклонения. Платформа интегрировалась без доработок ERP.",
  },
];

const Reviews = () => {
  return (
    <section className={styles.section} id="reviews">
      <div className={styles.header}>
        <span className={styles.badge}>Отзывы</span>
        <h2>Команды доверяют Agregator для ежедневной аналитики</h2>
      </div>
      <div className={styles.list}>
        {reviews.map((review) => (
          <article className={styles.review} key={review.name}>
            <p className={styles.quote}>
              <span>“</span>
              {review.quote}
            </p>
            <span className={styles.author}>{review.name}</span>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Reviews;

