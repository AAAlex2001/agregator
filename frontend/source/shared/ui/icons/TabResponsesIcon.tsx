import { FC, SVGProps } from "react";

interface TabResponsesIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const TabResponsesIcon: FC<TabResponsesIconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M4 10a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v3a6 6 0 0 1-6 6h-1.5l-3.5 2.5V19H10a6 6 0 0 1-6-6v-3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="m9 10.5 2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default TabResponsesIcon;
