import type { DirectionIconName } from "../../model/types";

/** Имя значка направления и его класс оформления. */
interface DirectionIconProps {
  name: DirectionIconName;
  className?: string;
}

/** Возвращает исходные SVG-контуры выбранного направления. */
function getDirectionPaths(name: DirectionIconName) {
  switch (name) {
    case "helmet":
      return (
        <>
          <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1z" />
          <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" />
          <path d="M4 15v-3a6 6 0 0 1 6-6" />
          <path d="M14 6a6 6 0 0 1 6 6v3" />
        </>
      );
    case "shield":
      return (
        <>
          <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          <path d="m9 12 2 2 4-4" />
        </>
      );
    case "gauge":
      return (
        <>
          <path d="m12 14 4-4" />
          <path d="M3.34 19a10 10 0 1 1 17.32 0" />
        </>
      );
    case "ruler":
      return (
        <>
          <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0z" />
          <path d="m14.5 12.5 2-2" />
          <path d="m11.5 9.5 2-2" />
          <path d="m8.5 6.5 2-2" />
          <path d="m17.5 15.5 2-2" />
        </>
      );
    case "compass":
      return (
        <>
          <circle
            cx="12"
            cy="12"
            r="10"
          />
          <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z" />
        </>
      );
    case "leaf":
      return (
        <>
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </>
      );
    case "flask":
      return (
        <>
          <path d="M10 2v7.5a2 2 0 0 1-.21.9L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14.2 10.4a2 2 0 0 1-.21-.9V2" />
          <path d="M8.5 2h7" />
          <path d="M7 16h10" />
        </>
      );
    case "map":
      return (
        <>
          <path d="M14.1 5.55a2 2 0 0 0 1.8 0l3.65-1.83A1 1 0 0 1 21 4.62v12.76a1 1 0 0 1-.55.9l-4.55 2.27a2 2 0 0 1-1.8 0l-4.2-2.1a2 2 0 0 0-1.8 0l-3.65 1.83A1 1 0 0 1 3 19.38V6.62a1 1 0 0 1 .55-.9l4.55-2.27a2 2 0 0 1 1.8 0z" />
          <path d="M15 5.76v15" />
          <path d="M9 3.24v15" />
        </>
      );
    case "scales":
      return (
        <>
          <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" />
          <path d="M7 21h10" />
          <path d="M12 3v18" />
          <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" />
        </>
      );
  }
}

/** Значок услуги в бегущей строке шапки. */
export function DirectionIcon({ name, className }: DirectionIconProps) {
  return (
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {getDirectionPaths(name)}
    </svg>
  );
}
