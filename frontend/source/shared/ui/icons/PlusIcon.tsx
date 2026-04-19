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
    <path
      d="M12 5V19"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transform: isOpen ? "scaleY(0)" : "scaleY(1)",
        transformOrigin: "12px 12px",
        transition: "transform 0.3s ease",
      }}
    />
    <path
      d="M5 12H19"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PlusIcon;
