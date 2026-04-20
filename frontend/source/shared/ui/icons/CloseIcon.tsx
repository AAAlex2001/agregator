import type { FC, SVGProps } from "react";

interface CloseIconProps extends SVGProps<SVGSVGElement> {
  title?: string;
}

const CloseIcon: FC<CloseIconProps> = ({ title, ...props }) => (
  <svg
    role="img"
    aria-label={title}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    {title ? <title>{title}</title> : null}
    <path d="M8 8L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M16 8L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default CloseIcon;