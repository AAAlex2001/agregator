const LifebuoyIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="3.4" />
    <path d="M5.64 5.64l3.17 3.17M15.19 15.19l3.17 3.17M18.36 5.64l-3.17 3.17M8.81 15.19l-3.17 3.17" />
  </svg>
);

export default LifebuoyIcon;
