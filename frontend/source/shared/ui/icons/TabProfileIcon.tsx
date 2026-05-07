import { FC, SVGProps } from "react";

interface TabProfileIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const TabProfileIcon: FC<TabProfileIconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M4 20v-1c0-3.3 3.6-6 8-6s8 2.7 8 6v1"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default TabProfileIcon;
