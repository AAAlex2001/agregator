interface Props {
  className?: string;
  size?: number;
}

/** Тонкая stroke-иконка «чат-бабл с силуэтом человека» — для пункта «Чат исполнителей» в сайдбаре. */
const ExpertRoomIcon = ({ className, size = 24 }: Props) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-5l-3.5 3v-3H6a2 2 0 0 1-2-2V6Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="9" r="1.75" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M8.5 14c.45-1.45 1.85-2.5 3.5-2.5s3.05 1.05 3.5 2.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default ExpertRoomIcon;
