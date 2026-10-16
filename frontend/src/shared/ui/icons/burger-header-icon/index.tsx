/** Оформление значка основного меню. */
interface BurgerHeaderIconProps {
  className?: string;
}

/** Три полосы для открытия меню кабинета. */
export function BurgerHeaderIcon({ className }: BurgerHeaderIconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
    >
      <path
        d="M3 7H21"
        stroke="var(--color-text-primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3 12H21"
        stroke="var(--color-text-primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M3 17H21"
        stroke="var(--color-text-primary)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
