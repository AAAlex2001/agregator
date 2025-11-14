import styles from "./how-it-works.module.scss";

const client = [
  {
    title: "Подключение",
    description: "Выбираете готовые коннекторы или создаёте свои через API и SDK Agregator.",
  },
  {
    title: "Оркестрация",
    description: "Настраиваете правила синхронизации, очистки и маршрутизации данных.",
  },
  {
    title: "Аналитика",
    description: "Получаете визуализации, алерты и отчёты в реальном времени и в едином формате.",
  },
];


const expert = [
  {
    title: "Подключение",
    description: "Выбираете готовые коннекторы или создаёте свои через API и SDK Agregator.",
  },
  {
    title: "Оркестрация",
    description: "Настраиваете правила синхронизации, очистки и маршрутизации данных.",
  },
  {
    title: "Аналитика",
    description: "Получаете визуализации, алерты и отчёты в реальном времени и в едином формате.",
  },
];

const HowItWorks = () => {
  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.intro}>
        <span className={styles.badge}>Процесс</span>
        <h2>Запуск занимает считанные дни, а не месяцы</h2>
        <p>
          Мы автоматизировали каждый этап. Команда сосредотачивается на метриках, пока платформа
          заботится о данных.
        </p>
      </div>
      <ol className={styles.steps}>
        {client.map((step, index) => (
          <li className={styles.step} key={step.title}>
            <span className={styles.index}>0{index + 1}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default HowItWorks;

