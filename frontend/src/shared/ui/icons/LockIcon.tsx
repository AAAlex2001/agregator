import React from "react";

interface LockIconProps {
  className?: string;
  size?: number;
  dotClassName?: string;
}

const LockIcon: React.FC<LockIconProps> = ({ className, size = 20, dotClassName }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      className={dotClassName}
      d="M9.16602 13.3333C9.16602 13.5543 9.25381 13.7663 9.41009 13.9226C9.56637 14.0789 9.77834 14.1667 9.99935 14.1667C10.2204 14.1667 10.4323 14.0789 10.5886 13.9226C10.7449 13.7663 10.8327 13.5543 10.8327 13.3333C10.8327 13.1123 10.7449 12.9004 10.5886 12.7441C10.4323 12.5878 10.2204 12.5 9.99935 12.5C9.77834 12.5 9.56637 12.5878 9.41009 12.7441C9.25381 12.9004 9.16602 13.1123 9.16602 13.3333Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.83398 9.16659C5.83398 9.16659 5.83398 8.33326 5.83398 7.49993C5.83398 5.83324 6.56773 4.7917 7.34914 4.16658C8.13054 3.54146 8.89558 3.33325 10.0007 3.33325C11.1057 3.33325 11.8708 3.54146 12.6522 4.16658C13.4336 4.7917 14.1673 5.83324 14.1673 7.49993C14.1673 8.74996 14.1673 9.16659 14.1673 9.16659"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.16602 10.8334C4.16602 10.3914 4.34161 9.96746 4.65417 9.6549C4.96673 9.34234 5.39065 9.16675 5.83268 9.16675H14.166C14.608 9.16675 15.032 9.34234 15.3445 9.6549C15.6571 9.96746 15.8327 10.3914 15.8327 10.8334V15.8334C15.8327 16.2754 15.6571 16.6994 15.3445 17.0119C15.032 17.3245 14.608 17.5001 14.166 17.5001H5.83268C5.39065 17.5001 4.96673 17.3245 4.65417 17.0119C4.34161 16.6994 4.16602 16.2754 4.16602 15.8334V10.8334Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.99902 13.75C10.0449 13.75 10.0828 13.7871 10.083 13.833C10.083 13.879 10.045 13.917 9.99902 13.917C9.95315 13.9168 9.91602 13.8789 9.91602 13.833C9.91619 13.7872 9.95326 13.7502 9.99902 13.75Z"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

export default LockIcon;
