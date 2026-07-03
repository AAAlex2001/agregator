import { FC, SVGProps } from "react";

interface PromoAppIconProps extends SVGProps<SVGSVGElement> {
  title?: string;
}

const PromoAppIcon: FC<PromoAppIconProps> = ({ title, ...props }) => (
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
    <rect
      x="5.5"
      y="1.8"
      width="13"
      height="20.4"
      rx="3.4"
      fill="currentColor"
      fillOpacity="0.16"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <path d="M10.4 4h3.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    <rect x="8" y="6.7" width="3.4" height="3.4" rx="1.05" fill="currentColor" />
    <rect x="12.6" y="6.7" width="3.4" height="3.4" rx="1.05" fill="currentColor" fillOpacity="0.5" />
    <rect x="8" y="11.2" width="3.4" height="3.4" rx="1.05" fill="currentColor" fillOpacity="0.5" />
    <rect x="12.6" y="11.2" width="3.4" height="3.4" rx="1.05" fill="currentColor" />
    <path d="M9.8 19.4h4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
  </svg>
);

export default PromoAppIcon;
