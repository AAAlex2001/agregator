/** Дополнительный класс стрелки раскрытия. */
interface ChatChevronDownIconProps {
  className?: string;
}

/** Стрелка раскрытия карточек и дополнительных документов. */
export function ChatChevronDownIcon({ className }: ChatChevronDownIconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 9L12 15L18 9"
        stroke="var(--color-orange-soft)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
