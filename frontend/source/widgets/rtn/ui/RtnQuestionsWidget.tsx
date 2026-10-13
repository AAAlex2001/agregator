"use client";

import { useState } from "react";
import { AskQuestionForm } from "@/source/features/rtn/ask-question";
import { MyQuestionList } from "@/source/features/rtn/my-questions";
import { PublicQuestionList } from "@/source/features/rtn/public-questions";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { Subtitle, Title } from "@/source/shared/ui/Typography";
import { RtnGuestPrompt } from "./RtnGuestPrompt";
import s from "./RtnQuestionsWidget.module.scss";

interface RtnQuestionsWidgetProps {
  basePath: string;
  authenticated: boolean;
}

/**
 * Страница «Задать вопрос»: форма (гостю — вход), свои вопросы и вопросы на рассмотрении.
 * После отправки вопроса список своих вопросов создаётся заново и перечитывается.
 */
export function RtnQuestionsWidget({ basePath, authenticated }: RtnQuestionsWidgetProps) {
  const [myQuestionsVersion, setMyQuestionsVersion] = useState(0);
  const reloadMyQuestions = () => setMyQuestionsVersion(myQuestionsVersion + 1);

  return (
    <div className={s.wrapper}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: basePath || "/" },
          { label: "Ростехнадзор отвечает", href: `${basePath}/rtn` },
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
        <div className={s.questionImage} aria-hidden="true" />
        <div className={s.questionContent}>
          {authenticated ? <AskQuestionForm onSent={reloadMyQuestions} /> : <RtnGuestPrompt />}
        </div>
      </section>

      {authenticated && (
        <section className={s.questionsSection}>
          <div className={s.sectionHead}>
            <Title text="Ваши вопросы" as="h2" className={s.sectionTitle} />
            <Subtitle
              text="Следите за рассмотрением обращений и публикацией официальных ответов."
              className={s.sectionSubtitle}
            />
          </div>
          <MyQuestionList key={myQuestionsVersion} basePath={basePath} onRetry={reloadMyQuestions} />
        </section>
      )}

      <section className={s.questionsSection}>
        <div className={s.sectionHead}>
          <Title text="Вопросы на рассмотрении" as="h2" className={s.sectionTitle} />
          <Subtitle
            text="Обращения, которые уже переданы в работу. Если у вас есть ответ ведомства по такому вопросу — приложите документ, а если ждёте ответа — подпишитесь на публикацию."
            className={s.sectionSubtitle}
          />
        </div>
        <PublicQuestionList basePath={basePath} />
      </section>
    </div>
  );
}
