/** Класс оформления иконки подзаголовка. */
interface Heading3IconProps {
  className?: string;
}

/** Заголовок третьего уровня. */
export function Heading3Icon({ className }: Heading3IconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M4 12h8M4 18V6M12 18V6
           M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2
           M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
