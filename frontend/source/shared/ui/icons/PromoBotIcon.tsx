import { FC, SVGProps } from "react";

interface PromoBotIconProps extends SVGProps<SVGSVGElement> {
  title?: string;
}

const PromoBotIcon: FC<PromoBotIconProps> = ({ title, ...props }) => (
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
    <path d="M12 1.9V4.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    <circle cx="12" cy="1.5" r="1.25" fill="currentColor" />
    <rect x="1.6" y="10" width="2.4" height="5" rx="1.2" fill="currentColor" />
    <rect x="20" y="10" width="2.4" height="5" rx="1.2" fill="currentColor" />
    <rect
      x="4.2"
      y="4.1"
      width="15.6"
      height="14.9"
      rx="4.6"
      fill="currentColor"
      fillOpacity="0.16"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <rect x="6.8" y="8" width="10.4" height="7.2" rx="2.6" fill="currentColor" fillOpacity="0.24" />
    <circle cx="9.7" cy="11.3" r="1.4" fill="currentColor" />
    <circle cx="14.3" cy="11.3" r="1.4" fill="currentColor" />
    <path d="M9.8 13.8c.75.6 3.65.6 4.4 0" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export default PromoBotIcon;
