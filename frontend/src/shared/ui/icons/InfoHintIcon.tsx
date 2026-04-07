import { FC, SVGProps } from "react";

interface InfoHintIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

const InfoHintIcon: FC<InfoHintIconProps> = ({ size = 20, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    {...props}
  >
    <path
      d="M18.68 1.48H5.32A3.82 3.82 0 0 0 1.5 5.3v9.54a3.82 3.82 0 0 0 3.82 3.82h3.82L12 21.52l2.86-2.86h3.82a3.82 3.82 0 0 0 3.82-3.82V5.3A3.82 3.82 0 0 0 18.68 1.48Z"
      fill="var(--info-icon-fill, transparent)"
      stroke="var(--info-icon-stroke, #ff8b3d)"
      strokeWidth="1.91"
      strokeMiterlimit="10"
      className="info-icon-bubble"
    />
    <line
      x1="10.09"
      y1="13.89"
      x2="13.91"
      y2="13.89"
      stroke="var(--info-icon-detail, #ff8b3d)"
      strokeWidth="1.91"
      strokeMiterlimit="10"
      className="info-icon-detail"
    />
    <polyline
      points="10.09 8.16 12 8.16 12 13.89"
      fill="none"
      stroke="var(--info-icon-detail, #ff8b3d)"
      strokeWidth="1.91"
      strokeMiterlimit="10"
      className="info-icon-detail"
    />
    <line
      x1="11.05"
      y1="5.3"
      x2="12.95"
      y2="5.3"
      stroke="var(--info-icon-detail, #ff8b3d)"
      strokeWidth="1.91"
      strokeMiterlimit="10"
      className="info-icon-detail"
    />
  </svg>
);

export default InfoHintIcon;
