import { FC, SVGProps } from "react";

interface ReviewIconProps extends SVGProps<SVGSVGElement> {
  title?: string;
}

const ReviewIcon: FC<ReviewIconProps> = ({ title, ...props }) => (
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
    {title && <title>{title}</title>}
    <path
      d="M11.48 3.5a.6.6 0 0 1 1.04 0l2.45 4.43c.08.14.22.24.38.27l4.96.93c.5.09.7.71.34 1.07l-3.5 3.55a.6.6 0 0 0-.16.5l.66 4.97c.07.5-.46.88-.92.65l-4.5-2.18a.6.6 0 0 0-.52 0l-4.5 2.18c-.46.23-.99-.15-.92-.65l.66-4.97a.6.6 0 0 0-.16-.5l-3.5-3.55c-.36-.36-.16-.98.34-1.07l4.96-.93a.6.6 0 0 0 .38-.27l2.45-4.43Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export default ReviewIcon;
