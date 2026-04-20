import { FC, SVGProps } from "react";

interface TabChatIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const TabChatIcon: FC<TabChatIconProps> = ({ size = 26, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4 3.5V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 10h8M8 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default TabChatIcon;
