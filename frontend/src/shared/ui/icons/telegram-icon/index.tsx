/** Класс оформления иконки Telegram. */
interface TelegramIconProps {
  className?: string;
}

/** Бумажный самолётик Telegram. */
export function TelegramIcon({ className }: TelegramIconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M21.2 4.4 2.9 11.5c-.9.4-.9 1.6.1 1.9l4.6 1.4 1.8 5.6c.3.8 1.3 1 1.9.4l2.6-2.4 4.6 3.4c.7.5 1.7.1 1.9-.7l3.1-14.5c.2-1-.8-1.8-1.7-1.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m7.6 14.8 9.5-6.6-7.3 7.4-.3 4.1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
