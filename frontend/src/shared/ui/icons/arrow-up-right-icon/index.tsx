/** Дополнительный класс стрелки внешнего перехода. */
interface ArrowUpRightIconProps {
  className?: string;
}

/** Обозначает переход к материалу на внешнем сайте. */
export function ArrowUpRightIcon({ className }: ArrowUpRightIconProps) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
