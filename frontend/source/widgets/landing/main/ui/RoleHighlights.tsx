"use client";

import { Title, Subtitle } from "@/source/shared/ui/Typography";
import s from "./role-highlights.module.scss";

const HIGHLIGHTS = [
  {
    id: "customer",
    background: "#fff6ea",
    video: "/landing/main/customer.mp4",
    title: "Заказчикам: заказ за пару минут",
    text: "Опишите задачу по своему направлению — от экспертизы промышленной безопасности до кадастровых работ. Профильные исполнители откликнутся с ценой и сроками, а сравнить предложения, отзывы и рейтинг можно в одном окне.",
  },
  {
    id: "expert",
    background: "#eef6ef",
    video: "/landing/main/expert.mp4",
    title: "Исполнителям: заказы по вашему профилю",
    text: "Заполните анкеты направлений — подходящие заказы найдут вас сами. Уведомления о новых заявках, прямое общение с заказчиком в чате и рейтинг за выполненные работы.",
  },
  {
    id: "holder",
    background: "#eef3fa",
    video: "/landing/main/holder.mp4",
    title: "Держателям разрешительных документов: лицензии работают на вас",
    text: "Разместите лицензии и аккредитации — исполнители и заказчики найдут вас для совместной работы. Условия предоставления документов вы определяете сами.",
  },
];

export function RoleHighlights() {
  return (
    <section className={s.section}>
      {HIGHLIGHTS.map((item, index) => (
        <article
          key={item.id}
          className={index % 2 === 1 ? `${s.card} ${s.cardReverse}` : s.card}
          style={{ background: item.background }}
        >
          <div className={s.media}>
            <video
              className={s.video}
              src={item.video}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              onEnded={(event) => {
                event.currentTarget.currentTime = 0;
                void event.currentTarget.play();
              }}
            />
          </div>
          <div className={s.copy}>
            <Title as="h2" text={item.title} />
            <Subtitle className={s.text} text={item.text} />
          </div>
        </article>
      ))}
    </section>
  );
}
