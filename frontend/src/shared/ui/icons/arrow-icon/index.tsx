/** Оформление и цвет стрелки. */
interface ArrowIconProps {
  className?: string;
  color?: string;
}

/** Стрелка перехода вперёд. */
export function ArrowIcon({ className, color = "currentColor" }: ArrowIconProps) {
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
        d="M19 12L13 18M19 12L13 6M19 12H5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
