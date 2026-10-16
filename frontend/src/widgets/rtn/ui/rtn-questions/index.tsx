"use client";

import { useMyRtnQuestions } from "@/entities/rtn";
import { AskRtnQuestionForm } from "@/features/ask-rtn-question";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { MyRtnQuestions } from "../my-rtn-questions";
import { PublicRtnQuestions } from "../public-rtn-questions";
import { RtnQuestionGuestPrompt } from "../rtn-question-guest-prompt";
import styles from "./style.module.scss";

/** Режим страницы обращений и действия общего окна авторизации. */
interface RtnQuestionsProps {
  basePath: string;
  authenticated: boolean;
  onLogin: () => void;
  onRegister: () => void;
}

/** Собирает отправку обращения, свои вопросы и публичные ответы сообщества. */
export function RtnQuestions({
  basePath,
  authenticated,
  onLogin,
  onRegister,
}: RtnQuestionsProps) {
  const { questions, isLoading, error, reload } = useMyRtnQuestions(authenticated);

  return (
    <div className={styles.wrapper}>
      <Breadcrumbs
        items={[
          {
            label: "Главная",
            href: basePath || "/",
          },
          {
            label: "Ростехнадзор отвечает",
            href: `${basePath}/rtn`,
          },
          {
            label: "Задать вопрос в Ростехнадзор",
          },
        ]}
      />
      <div className={styles.head}>
        <Title
          text="Задать вопрос в Ростехнадзор"
          as="h1"
          className={styles.pageTitle}
        />
        <Subtitle
          text="Передайте сложный вопрос по промышленной, энергетической или строительной безопасности. Мы подготовим обращение, направим его в Ростехнадзор и опубликуем официальный ответ."
          className={styles.pageSubtitle}
        />
      </div>
      <section className={styles.questionPanel}>
        <div
          className={styles.questionImage}
          aria-hidden="true"
        />
        <div className={styles.questionContent}>
          {authenticated ? (
            <AskRtnQuestionForm onSent={reload} />
          ) : (
            <RtnQuestionGuestPrompt
              onLogin={onLogin}
              onRegister={onRegister}
            />
          )}
        </div>
      </section>
      {authenticated && (
        <section className={styles.questionsSection}>
          <div className={styles.sectionHead}>
            <Title
              text="Ваши вопросы"
              as="h2"
              className={styles.sectionTitle}
            />
            <Subtitle
              text="Следите за рассмотрением обращений и публикацией официальных ответов."
              className={styles.sectionSubtitle}
            />
          </div>
          <MyRtnQuestions
            questions={questions}
            isLoading={isLoading}
            error={error}
            basePath={basePath}
            onRetry={reload}
          />
        </section>
      )}
      <section className={styles.questionsSection}>
        <div className={styles.sectionHead}>
          <Title
            text="Вопросы на рассмотрении"
            as="h2"
            className={styles.sectionTitle}
          />
          <Subtitle
            text="Обращения, которые уже переданы в работу. Если у вас есть ответ ведомства по такому вопросу — приложите документ, а если ждёте ответа — подпишитесь на публикацию."
            className={styles.sectionSubtitle}
          />
        </div>
        <PublicRtnQuestions basePath={basePath} />
      </section>
    </div>
  );
}
