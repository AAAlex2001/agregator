import React from "react";

interface EyeOpenIconProps {
  className?: string;
  size?: number;
}

const EyeOpenIcon: React.FC<EyeOpenIconProps> = ({ className, size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M17.5 10C17.5 11 14.1417 15 10 15C5.85833 15 2.5 11 2.5 10C2.5 9 5.85833 5 10 5C14.1417 5 17.5 9 17.5 10Z"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M12.5 10C12.5 10.663 12.2366 11.2989 11.7678 11.7678C11.2989 12.2366 10.663 12.5 10 12.5C9.33696 12.5 8.70107 12.2366 8.23223 11.7678C7.76339 11.2989 7.5 10.663 7.5 10C7.5 9.33696 7.76339 8.70107 8.23223 8.23223C8.70107 7.76339 9.33696 7.5 10 7.5C10.663 7.5 11.2989 7.76339 11.7678 8.23223C12.2366 8.70107 12.5 9.33696 12.5 10Z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

export default EyeOpenIcon;
