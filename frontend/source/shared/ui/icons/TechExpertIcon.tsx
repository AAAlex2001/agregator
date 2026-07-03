interface TechExpertIconProps {
  className?: string;
}

const TechExpertIcon = ({ className }: TechExpertIconProps) => (
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
      d="M13 3H6C5.44772 3 5 3.44772 5 4V20C5 20.5523 5.44772 21 6 21H10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M13 3L19 9V11"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M13 3V9H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="15.5" cy="15.5" r="3.5" stroke="currentColor" strokeWidth="2" />
    <path d="M18.5 18.5L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default TechExpertIcon;
