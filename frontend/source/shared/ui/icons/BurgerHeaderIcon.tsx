import { FC, SVGProps } from "react";

interface BurgerHeaderIconProps extends SVGProps<SVGSVGElement> {
  title?: string;
}

const BurgerHeaderIcon: FC<BurgerHeaderIconProps> = ({ title, ...props }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={title}
    {...props}
  >
    {title && <title>{title}</title>}
    <path d="M3 7H21" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
    <path d="M3 12H21" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
    <path d="M3 17H21" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default BurgerHeaderIcon;
