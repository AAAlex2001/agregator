/** Оформление и цвет стрелки раскрытия. */
interface ChevronIconProps {
  className?: string;
  color?: string;
}

/** Стрелка раскрытия списка. */
export function ChevronIcon({
  className,
  color = "var(--color-orange-bright)",
}: ChevronIconProps) {
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
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
