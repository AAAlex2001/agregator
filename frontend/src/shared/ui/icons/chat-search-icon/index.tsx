/** Класс оформления лупы. */
interface ChatSearchIconProps {
  className?: string;
}

/** Лупа в поле поиска по диалогам; цвет берёт из текста поля. */
export function ChatSearchIcon({ className }: ChatSearchIconProps) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M17.5 17.5L13.8807 13.8807M13.8807 13.8807C15.0871 12.6743 15.8333 11.0076 15.8333
           9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667
           C2.5 12.8486 5.48477 15.8333 9.16667 15.8333C11.0076 15.8333 12.6743 15.0871
           13.8807 13.8807Z"
        stroke="currentColor"
        strokeWidth="1.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
