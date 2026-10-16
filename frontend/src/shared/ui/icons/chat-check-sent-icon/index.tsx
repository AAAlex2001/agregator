/** Класс оформления отметки об отправке. */
interface ChatCheckSentIconProps {
  className?: string;
}

/** Одна серая галочка: сообщение отправлено, но ещё не прочитано. */
export function ChatCheckSentIcon({ className }: ChatCheckSentIconProps) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.22656 8.9965L7.40881 12.1788L13.7718 5.815"
        stroke="var(--color-text-placeholder)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
