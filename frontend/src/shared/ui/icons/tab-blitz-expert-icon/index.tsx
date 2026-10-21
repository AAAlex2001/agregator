/** Оформление значка Блиц-эксперта. */
interface TabBlitzExpertIconProps {
  className?: string;
}

/** Документ с молнией: быстрая экспертиза. */
export function TabBlitzExpertIcon({ className }: TabBlitzExpertIconProps) {
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
        d="M7.25 3.75h6.25L18 8.25v10.5a1.5 1.5 0 0 1-1.5 1.5h-9.25a1.5 1.5 0 0 1-1.5-1.5v-13.5a1.5 1.5 0 0 1 1.5-1.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 3.75V7a1.25 1.25 0 0 0 1.25 1.25H18"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12.75 10.25 9.75 14.5h2.75l-.75 3.25 3-4.25H12l.75-3.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}