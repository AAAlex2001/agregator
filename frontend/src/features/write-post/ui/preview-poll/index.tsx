import type { TelegramPoll } from "@/entities/post";
import styles from "./style.module.scss";

/** Опрос после поста. */
interface PreviewPollProps {
  poll: TelegramPoll;
}

/** Опрос отдельным сообщением: вопрос, вид и варианты. */
export function PreviewPoll({ poll }: PreviewPollProps) {
  const kind = poll.is_anonymous ? "Анонимный опрос" : "Опрос";

  return (
    <div className={styles.poll}>
      <strong className={styles.question}>{poll.question || "Вопрос"}</strong>
      <span className={styles.kind}>
        {poll.allows_multiple_answers ? `${kind} · несколько ответов` : kind}
      </span>
      <ul className={styles.options}>
        {poll.options.map((option, index) => (
          <li
            key={index}
            className={styles.option}
          >
            {option || `Вариант ${index + 1}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
