interface ChatCheckReadIconProps {
  className?: string;
}

const ChatCheckReadIcon = ({ className }: ChatCheckReadIconProps) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 9.36375L9.18225 12.546L15.5452 6.18225M2.25 9.36375L5.43225 12.546M11.796 6.18225L9.375 8.625"
      stroke="#FF8A00"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ChatCheckReadIcon;
