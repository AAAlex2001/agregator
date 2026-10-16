/** Класс оформления иконки меню. */
interface EllipsisIconProps {
  className?: string;
}

/** Три точки — открыть меню действий. */
export function EllipsisIcon({ className }: EllipsisIconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle
        cx="5"
        cy="12"
        r="1.5"
      />
      <circle
        cx="12"
        cy="12"
        r="1.5"
      />
      <circle
        cx="19"
        cy="12"
        r="1.5"
      />
    </svg>
  );
}
