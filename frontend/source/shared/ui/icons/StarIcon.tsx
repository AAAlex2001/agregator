interface StarIconProps {
  className?: string;
  filled?: boolean;
  width?: number | string;
  height?: number | string;
}

const StarIcon = ({ className, filled = true, width = 16, height = 16 }: StarIconProps) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
    focusable="false"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 1.33337L10.06 5.50671L14.6667 6.18004L11.3333 9.42671L12.12 14.0134L8 11.8467L3.88 14.0134L4.66667 9.42671L1.33333 6.18004L5.94 5.50671L8 1.33337Z"
      fill={filled ? "#FFB800" : "#E6E6E6"}
      stroke={filled ? "#FFB800" : "#E6E6E6"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default StarIcon;
