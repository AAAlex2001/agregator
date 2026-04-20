import { FC, SVGProps } from "react";

interface TabReviewsIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const TabReviewsIcon: FC<TabReviewsIconProps> = ({ size = 24, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="m12 3 2.6 5.4 5.9.9-4.3 4.1 1 5.8L12 16.5 6.8 19.2l1-5.8L3.5 9.3l5.9-.9L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

export default TabReviewsIcon;
