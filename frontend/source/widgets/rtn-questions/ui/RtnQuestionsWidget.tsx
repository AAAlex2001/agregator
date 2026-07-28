"use client";

import { useState } from "react";
import { RtnQuestionComposer } from "@/source/features/rtn-feedback";
import { RtnQuestionList } from "@/source/features/rtn-question-list";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
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

      <section className={s.hero}>
        <div className={s.heroCopy}>
          <span className={s.eyebrow}>Официальное обращение</span>
          <h1>Задать вопрос в Ростехнадзор</h1>
          <p>
            Передайте сложный вопрос по промышленной, энергетической или строительной безопасности.
            Мы подготовим обращение, направим его в Ростехнадзор и опубликуем официальный ответ.
          </p>
        </div>
      </section>

      {authenticated ? (
        <>
          <RtnQuestionComposer onSubmitted={() => setRefreshKey((value) => value + 1)} />
          <section className={s.questionsSection}>
            <div className={s.sectionHead}>
              <div>
                <h2>Ваши вопросы</h2>
                <p>Следите за рассмотрением обращений и публикацией официальных ответов.</p>
              </div>
            </div>
            <RtnQuestionList refreshKey={refreshKey} />
          </section>
        </>
      ) : (
        <RtnGuestPrompt />
      )}
    </div>
  );
}
