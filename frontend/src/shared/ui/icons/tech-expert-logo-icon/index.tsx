/** Оформление, размер и доступное название логотипа. */
interface TechExpertLogoIconProps {
  className?: string;
  title?: string;
  width?: number;
  height?: number;
}

/** Логотип сервиса ТехЭксперт для меню платформы. */
export function TechExpertLogoIcon({
  className,
  title,
  width = 170,
  height = 40,
}: TechExpertLogoIconProps) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 424 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      preserveAspectRatio="xMidYMid meet"
    >
      {title && <title>{title}</title>}
      <text
        x="0"
        y="72"
        textLength="292"
        lengthAdjust="spacingAndGlyphs"
        fill="var(--color-tech-expert-text)"
        fontFamily="Montserrat"
        fontSize="72"
        fontWeight="900"
      >
        ТЕХЭКСПЕ
      </text>
      <g fill="var(--color-tech-expert-emblem)">
        <circle
          cx="338"
          cy="50"
          r="38"
          fill="none"
          stroke="var(--color-tech-expert-emblem)"
          strokeWidth="10"
        />
        <text
          x="338"
          y="74"
          textAnchor="middle"
          fontFamily="Montserrat"
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
        fill="var(--color-tech-expert-text)"
        fontFamily="Montserrat"
        fontSize="72"
        fontWeight="900"
      >
        Т
      </text>
    </svg>
  );
}
