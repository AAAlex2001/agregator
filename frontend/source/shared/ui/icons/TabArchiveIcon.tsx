import { FC, SVGProps } from "react";

interface TabArchiveIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const TabArchiveIcon: FC<TabArchiveIconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3.5" y="4" width="17" height="4" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 8.5v9.5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M10 12h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default TabArchiveIcon;
