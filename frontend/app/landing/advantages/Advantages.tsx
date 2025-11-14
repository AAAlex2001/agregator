import styles from "./advantages.module.scss";
import Image from "next/image";

const features = [
  {
      id: 1,
    title: "Аттестованные эксперты",
    description: "Специалисты всех 15 областей аттестации по Приказу Ростехнадзора. Самостоятельно выбирайте для себя подходящих экспертов",
    icon: "/icon_diploma.svg",
  },
  {
      id: 2,
    title: "Решение за 1–2 дня",
    description: "Размещайте заказы и получайте отклики от исполнителей. Первые предложения могут поступить уже в день размещения",
    icon: "/icon_quick.svg",
  },
  {
        id: 3,
    title: "Точечный поиск",
    description: "Ищите заказы и экспертов с фильтрами по отраслям и видам работ. Используйте возможности поиска на платформе",
    icon: "/icon_search.svg",
  },
  {
        id: 4,
    title: "Рейтинг и отзывы",
    description: "После завершения работы заказчик ставит оценку и пишет отзыв. Так на платформе формируется репутация эксперта",
    icon: "/icon_comment.svg",
  },
];

const Advantages = () => {
  return (
    <section className={styles.section} id="advantages">
      <div className={styles.card}>
        {features.map((feature) => (
          <article className={styles.feature} key={feature.id}>
              <div className={styles.featureHeader}>
            {feature.icon && (
              <Image src={feature.icon} alt={feature.title} width={48} height={48} />
            )}
            <h3>{feature.title}</h3>
                </div>
            <p>{feature.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Advantages;

