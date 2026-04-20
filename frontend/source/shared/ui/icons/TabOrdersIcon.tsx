import { FC, SVGProps } from "react";

interface TabOrdersIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const TabOrdersIcon: FC<TabOrdersIconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8.5 12c0-2.15 0-3.22.67-3.89.66-.67 1.73-.67 3.88-.67h2.28c2.15 0 3.23 0 3.9.67.67.67.67 1.74.67 3.89v3.81c0 2.15 0 3.23-.67 3.9-.67.66-1.75.66-3.9.66h-2.28c-2.15 0-3.22 0-3.88-.66-.67-.67-.67-1.75-.67-3.9V12Z" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8.5 18.1a2.28 2.28 0 0 1-2.28-2.28v-4.57c0-2.87 0-4.31.9-5.2.88-.89 2.32-.89 5.19-.89h3.05a2.28 2.28 0 0 1 2.28 2.28" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6.22 15.82a2.28 2.28 0 0 1-2.28-2.28V9a6.64 6.64 0 0 1 .9-5.2C5.72 3 7.16 3 10.03 3h3.05a2.28 2.28 0 0 1 2.28 2.28" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export default TabOrdersIcon;
