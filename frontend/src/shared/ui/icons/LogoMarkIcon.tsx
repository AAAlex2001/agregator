import { FC, SVGProps } from "react";

interface LogoMarkIconProps extends SVGProps<SVGSVGElement> {
  title?: string;
}

const LogoMarkIcon: FC<LogoMarkIconProps> = ({ title, ...props }) => (
  <svg
    width="38"
    height="38"
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={title}
    {...props}
  >
    {title && <title>{title}</title>}
    <path
      d="M15.9471 19.6548L16.3072 19.8358C17.2553 20.3098 18.3008 20.5567 19.3608 20.5567C20.4208 20.5567 21.4663 20.3098 22.4144 19.8358L22.7745 19.6548M14.2402 9.41371C14.2402 8.50833 14.5999 7.64005 15.2401 6.99985C15.8803 6.35966 16.7486 6 17.6539 6H21.0677C21.973 6 22.8413 6.35966 23.4815 6.99985C24.1217 7.64005 24.4814 8.50833 24.4814 9.41371V11.1206H14.2402V9.41371Z"
      stroke="url(#paint0_linear_logo_mark)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M31.3097 11.1201H7.41371C5.52837 11.1201 4 12.6485 4 14.5338V28.1886C4 30.074 5.52837 31.6023 7.41371 31.6023H31.3097C33.195 31.6023 34.7234 30.074 34.7234 28.1886V14.5338C34.7234 12.6485 33.195 11.1201 31.3097 11.1201Z"
      stroke="url(#paint1_linear_logo_mark)"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_logo_mark"
        x1="14.2402"
        y1="13.2783"
        x2="24.4814"
        y2="13.2783"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFB800" />
        <stop offset="1" stopColor="#FF8A00" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_logo_mark"
        x1="4"
        y1="21.3612"
        x2="34.7234"
        y2="21.3612"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFB800" />
        <stop offset="1" stopColor="#FF8A00" />
      </linearGradient>
    </defs>
  </svg>
);

export default LogoMarkIcon;
