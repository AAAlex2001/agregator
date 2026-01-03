interface PlusIconProps {
  className?: string;
  isOpen?: boolean;
}

const PlusIcon = ({ className, isOpen = false }: PlusIconProps) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_plus)">
      <path
        d="M10 1.5V18.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          transform: isOpen ? "scaleY(0)" : "scaleY(1)",
          transformOrigin: "center",
          transition: "transform 0.3s ease",
        }}
      />
      <path
        d="M1.5 10H18.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_plus">
        <rect width="20" height="20" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default PlusIcon;
