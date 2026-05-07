import { FC, SVGProps } from "react";

interface TabSupportIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const TabSupportIcon: FC<TabSupportIconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5l-3.5 3v-3H6a2 2 0 0 1-2-2V7Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M9.5 10.25c0-1.24 1.12-2.25 2.5-2.25s2.5 1.01 2.5 2.25c0 .79-.42 1.34-1.06 1.79-.83.59-1.31 1-1.31 1.71"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="12" cy="15.5" r="0.85" fill="currentColor" />
  </svg>
);

export default TabSupportIcon;
