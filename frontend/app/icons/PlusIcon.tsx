interface PlusIconProps {
  className?: string;
  isOpen?: boolean;
}

const PlusIcon = ({ className, isOpen = false }: PlusIconProps) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
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
          color: "FF8A00"
        }}
      />
      <path
        d="M1.5 10H18.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          color: 'FF8A00'
        }}
      />
    </g>
    <defs>
      <clipPath id="clip0_plus">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default PlusIcon;
