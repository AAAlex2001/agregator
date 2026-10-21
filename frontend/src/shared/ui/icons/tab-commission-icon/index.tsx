/** Оформление значка конкурсной комиссии. */
interface TabCommissionIconProps {
  className?: string;
}

/** Человек с медалью: отбор экспертов. */
export function TabCommissionIcon({ className }: TabCommissionIconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="10"
        cy="7.75"
        r="3.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4.25 19.5c.55-3.1 2.95-5 5.75-5 1.1 0 2.15.3 3 .85"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="17.25"
        cy="15.25"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m15.9 17.35-.65 3.15 2-1 2 1-.65-3.15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}