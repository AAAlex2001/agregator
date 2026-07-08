import { FC, SVGProps } from "react";

interface TechExpertLogoIconProps extends SVGProps<SVGSVGElement> {
  title?: string;
}

const TechExpertLogoIcon: FC<TechExpertLogoIconProps> = ({ title, ...props }) => (
  <svg
    width="170"
    height="40"
    viewBox="0 0 424 100"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label={title}
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    {title && <title>{title}</title>}
    <text
      x="0"
      y="72"
      textLength="292"
      lengthAdjust="spacingAndGlyphs"
      fill="#06445f"
      fontFamily="Arial Black, Impact, Montserrat, system-ui, sans-serif"
      fontSize="72"
      fontWeight="900"
    >
      ТЕХЭКСПЕ
    </text>
    <g fill="#d87900">
      <circle cx="338" cy="50" r="38" fill="none" stroke="#d87900" strokeWidth="10" />
      <text
        x="338"
        y="74"
        textAnchor="middle"
        fontFamily="Arial Black, Impact, Montserrat, system-ui, sans-serif"
        fontSize="72"
        fontWeight="900"
      >
        R
      </text>
    </g>
    <text
      x="386"
      y="72"
      textLength="38"
      lengthAdjust="spacingAndGlyphs"
      fill="#06445f"
      fontFamily="Arial Black, Impact, Montserrat, system-ui, sans-serif"
      fontSize="72"
      fontWeight="900"
    >
      Т
    </text>
  </svg>
);

export default TechExpertLogoIcon;
