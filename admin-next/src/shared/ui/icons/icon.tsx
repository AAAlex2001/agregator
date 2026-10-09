import type { ReactNode } from "react";

export type IconProps = {
  className?: string;
};

type IconFrameProps = IconProps & {
  children: ReactNode;
};

/** Общая обёртка иконок: контурный SVG 24×24, цвет берётся из текста. */
export const Icon = ({ className, children }: IconFrameProps) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {children}
  </svg>
);
