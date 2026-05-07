import { FC, SVGProps } from "react";

interface SupportHeaderIconProps extends SVGProps<SVGSVGElement> {
  title?: string;
}

const SupportHeaderIcon: FC<SupportHeaderIconProps> = ({ title, ...props }) => (
  <svg
    width="24"
    height="24"
    viewBox="13 14 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={title}
    {...props}
  >
    {title && <title>{title}</title>}
    <path
      d="M14 17.5C14 16.1193 15.1193 15 16.5 15H27.5C28.8807 15 30 16.1193 30 17.5V25.5C30 26.8807 28.8807 28 27.5 28H22.4142C22.149 28 21.8946 28.1054 21.7071 28.2929L18.7071 31.2929C18.0771 31.9229 17 31.4767 17 30.5858V28C15.3431 28 14 26.6569 14 25V17.5Z"
      fill="currentColor"
      fillOpacity="0.16"
    />
    <path
      d="M14 17.5C14 16.1193 15.1193 15 16.5 15H27.5C28.8807 15 30 16.1193 30 17.5V25.5C30 26.8807 28.8807 28 27.5 28H22.4142C22.149 28 21.8946 28.1054 21.7071 28.2929L18.7071 31.2929C18.0771 31.9229 17 31.4767 17 30.5858V28C15.3431 28 14 26.6569 14 25V17.5Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    />
    <path
      d="M20 19.75C20 18.5074 21.0074 17.5 22.25 17.5C23.4926 17.5 24.5 18.5074 24.5 19.75C24.5 20.5 24.1 21.05 23.5 21.5C22.7 22.0667 22.25 22.5 22.25 23.25"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <circle cx="22.25" cy="25.5" r="0.85" fill="currentColor" />
  </svg>
);

export default SupportHeaderIcon;
