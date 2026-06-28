interface LiningIconProps {
  className?: string;
}

const LiningIcon = ({ className }: LiningIconProps) => (
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
      d="M2 17.5a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M10 9.5V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M4 16v-3a6 6 0 0 1 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 7a6 6 0 0 1 6 6v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default LiningIcon;
