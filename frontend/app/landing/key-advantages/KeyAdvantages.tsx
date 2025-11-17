"use client"

import styles from "./key-advantages.module.scss";
import { useState } from "react";
import Image from "next/image";

const client = [
  {
      id: 1,
    title: "Мгновенное погружение в процессы",
    description: "Быстрое размещение заказов и моментальный старт поиска нужных специалистов вашего профиля",
      icon: "/number_1.svg"
  },
    {
      id: 2,
    title: "Прямые контакты с исполнителями",
    description: "Живое общение в чате для обсуждения деталей и согласование условий сотрудничества",
      icon: "/number_3.svg"
  },
  {
      id: 3,
    title: "Специалисты разного уровня сложности",
    description: "Подбор исполнителей для задач любой глубины — от геологоразведки до сопровождения работ",
      subDesription: "",
      icon: "/number_2.svg"
  },
  {
      id: 4,
    title: "Сообщество с репутационной системой",
    description: "Профессионалы, цени щие долгосрочные отношения и честную обратную связь по проектам",
      icon: "/number_4.svg"
  },
];


const expert = [
  {
      id: 1,
    title: "Мгновенный доступ к закрытым проектам",
    description: "Принимайте участие в актуальных проектах",
      icon: "/number_1.svg"
  },
  {
      id: 2,
    title: "Прямые договорённости с предприятиями",
    description: "Открытое общение заказчиками для согласования технических заданий и условий",
      icon: "/number_3.svg"
  },
    {
      id: 3,
    title: "Проекты соответствующей сложности и профиля",
    description: "Работайте над задачами, которые точно соответствуют вашей специализации и квалификации",
    subDesription: "*Комиссия платформы составляет 5% от суммы заказа и взимается перед началом работ. Если выбран другой исполнитель — средства возвращаются",
      icon: "/number_2.svg"
  },
  {
      id: 4,
    title: "Система репутации как актив",
    description: "Каждый успешный проект повышает ваш рейтинг и открывает доступ к более крупным заказам",
      icon: "/number_4.svg"
  },
];

const KeyAdvantages = () => {

    const [isExpert, setIsExpert] = useState(false);

  return (
    <section className={styles.section} id="key-advantages">
        <div className={styles.content}>
            <div className={styles.header}>
            <h1>Начните работать за 4 простых шага</h1>
            <p>
              Платформа устроена максимально прозрачно. Выбирайте свою роль:
            </p>
            </div>
                <div className={styles.stepsInfo}>
                        <div className={styles.stepsTabs}>
                            <span className={!isExpert ? styles.active : ''} onClick={() => setIsExpert(false)}>Я заказчик</span>
                            <span className={isExpert ? styles.active : ''} onClick={() => setIsExpert(true)}>Я эксперт</span>
                        </div>
              <div className={styles.steps}>
                {(isExpert ? expert : client).map((value) => (
                  <div className={styles.step} key={`${isExpert ? 'expert' : 'client'}-${value.id}`}>
                    <div className={styles.iconWrapper}>
                      <img src={value.icon} alt={value.title} />
                    </div>
                    <div className={styles.description}>
                      <h2>{value.title}</h2>
                      <p>{value.description}</p>
                      {value.subDesription && (
                        <span className={styles.subDescription}>{value.subDesription}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
                    </div>
            </div>
      <div className={styles.backgroundImage}>
        <Image src="/key-advantages.jpg" alt="Key advantages background" fill style={{ objectFit: "cover"  }} />
      </div>
    </section>
  );
};

export default KeyAdvantages;

