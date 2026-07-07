interface TelegramIconProps {
  className?: string;
}

const TelegramIcon = ({ className }: TelegramIconProps) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path
      fill="currentColor"
      d="M20.72 4.31c.32-.12.67.02.84.32.08.15.11.33.07.5l-3.16 14.9c-.2.92-.95 1.14-1.67.7l-4.8-3.54-2.31 2.22c-.26.26-.48.48-.99.48l.35-4.88 8.88-8.02c.39-.35-.08-.54-.6-.2L6.35 13.7 1.63 12.22c-1.02-.32-1.04-1.02.21-1.51L20.72 4.31Z"
    />
  </svg>
);

export default TelegramIcon;
