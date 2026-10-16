/** Оформление значка закрытия. */
interface CloseIconProps {
  className?: string;
}

/** Закрыть. */
export function CloseIcon({ className }: CloseIconProps) {
  return (
    <svg
      className={className}
      role="img"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 8L16 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M16 8L8 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
