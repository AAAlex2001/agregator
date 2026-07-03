import s from "./style.module.scss";

interface Props {
  question: string;
  answer: string;
}

export function QuestionItem({ question, answer }: Props) {
  return (
    <div className={s.item}>
      <p className={s.question}>{question}</p>
      <p className={s.answer}>{answer}</p>
    </div>
  );
}
