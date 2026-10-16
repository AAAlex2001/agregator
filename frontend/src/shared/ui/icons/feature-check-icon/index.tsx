/** Размер через CSS-класс для отметки пункта в списке преимуществ. */
interface FeatureCheckIconProps {
  className?: string;
}

/** Галочка на полупрозрачном круге для списка возможностей. */
export function FeatureCheckIcon({ className }: FeatureCheckIconProps) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle
        cx="10"
        cy="10"
        r="10"
        fill="var(--color-orange-bright)"
        fillOpacity="0.12"
      />
      <path
        d="M5.83 10.42l2.5 2.5 5.84-5.84"
        stroke="var(--color-orange-bright)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
