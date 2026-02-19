interface ChatChevronDownIconProps {
  className?: string;
}

const ChatChevronDownIcon = ({ className }: ChatChevronDownIconProps) => (
  <svg
    className={className}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 9L12 15L18 9"
      stroke="#FFDDA9"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ChatChevronDownIcon;
