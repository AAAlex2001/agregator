"use client";

import { useState } from "react";
import { RtnQuestionComposer } from "@/source/features/rtn-feedback";
import { RtnQuestionList } from "@/source/features/rtn-question-list";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import { RtnGuestPrompt } from "./RtnGuestPrompt";
import s from "./RtnQuestionsWidget.module.scss";

interface Props {
  authenticated: boolean;
  homeHref: string;
  catalogHref: string;
}

export function RtnQuestionsWidget({ authenticated, homeHref, catalogHref }: Props) {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className={s.wrapper}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: homeHref },
          { label: "Ростехнадзор отвечает", href: catalogHref },
          { label: "Задать вопрос в Ростехнадзор" },
        ]}
      />

      <div className={s.head}>
        <Title text="Задать вопрос в Ростехнадзор" as="h1" className={s.pageTitle} />
        <Subtitle
          text="Передайте сложный вопрос по промышленной, энергетической или строительной безопасности. Мы подготовим обращение, направим его в Ростехнадзор и опубликуем официальный ответ."
          className={s.pageSubtitle}
        />
      </div>

      <section className={s.questionPanel}>
        <div className={s.questionContent}>
          {authenticated ? (
          <RtnQuestionComposer onSubmitted={() => setRefreshKey((value) => value + 1)} />
          ) : (
            <RtnGuestPrompt />
          )}
        </div>
      </section>

      {authenticated ? (
          <section className={s.questionsSection}>
            <div className={s.sectionHead}>
              <div>
                <Title text="Ваши вопросы" as="h2" />
                <Subtitle text="Следите за рассмотрением обращений и публикацией официальных ответов." />
              </div>
            </div>
            <RtnQuestionList refreshKey={refreshKey} />
          </section>
      ) : (
        null
      )}
    </div>
  );
}
