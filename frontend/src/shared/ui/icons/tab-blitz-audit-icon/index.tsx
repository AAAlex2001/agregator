/** Оформление значка Блиц-аудита. */
interface TabBlitzAuditIconProps {
  className?: string;
}

/** Планшет с отметкой: аудит по перечню. */
export function TabBlitzAuditIcon({ className }: TabBlitzAuditIconProps) {
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
        d="M8.75 5H7.5A1.5 1.5 0 0 0 6 6.5v12.25a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5V6.5A1.5 1.5 0 0 0 16.5 5h-1.25"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <rect
        x="8.75"
        y="3.5"
        width="6.5"
        height="3"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m9.25 13.25 1.9 1.9 3.6-3.65"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}