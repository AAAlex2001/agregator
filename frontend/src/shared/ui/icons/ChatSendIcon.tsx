interface ChatSendIconProps {
  className?: string;
}

const ChatSendIcon = ({ className }: ChatSendIconProps) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17.5 2.5L9.17 10.83M17.5 2.5L12.5 17.5L9.17 10.83L2.5 7.5L17.5 2.5Z"
      stroke="white"
      strokeWidth="1.67"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ChatSendIcon;
