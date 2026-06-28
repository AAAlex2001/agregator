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
      d="M3 21V12a9 9 0 0 1 18 0v9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M3 13.5h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M8.5 21v-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M15.5 21v-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default LiningIcon;
