import type { OrderWorkType } from "@/source/entities/order";

interface Props {
  type: Exclude<OrderWorkType, "EXPERTISE">;
}

export function WorkTypeIcon({ type }: Props) {
  if (type === "DESIGN_SURVEY") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M9 9h23a4 4 0 0 1 4 4v26H13a4 4 0 0 1-4-4V9Z" fill="#E9F3FF" stroke="#2878D0" strokeWidth="2" />
        <path d="M15 16h15M15 22h10M15 28h7" stroke="#2878D0" strokeWidth="2.4" strokeLinecap="round" />
        <path d="m27 33 10-10 4 4-10 10-6 2 2-6Z" fill="#FFB800" stroke="#F27A00" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "INSPECTION_TESTING") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="21" cy="21" r="11" fill="#E9FBF7" stroke="#009B7A" strokeWidth="2.4" />
        <path d="m29 29 10 10" stroke="#006E59" strokeWidth="4" strokeLinecap="round" />
        <path d="M13 22h4l2-5 4 9 2-4h4" stroke="#FF8A00" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "RESEARCH_LAB") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden="true">
        <path d="M19 7h10M22 7v12L12 36a4 4 0 0 0 3.4 6h17.2a4 4 0 0 0 3.4-6L26 19V7" fill="#F4EDFF" stroke="#7A43C7" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 32h16l4 6a4 4 0 0 1-3.4 4H15.4a4 4 0 0 1-3.4-4l4-6Z" fill="#FFB800" opacity=".9" />
        <circle cx="21" cy="35" r="2" fill="#fff" /><circle cx="27" cy="38" r="1.5" fill="#fff" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="8" y="9" width="32" height="30" rx="7" fill="#FFF0E9" stroke="#E95B2B" strokeWidth="2" />
      <path d="M16 17h6v6h-6zM26 17h6v6h-6zM16 27h6v6h-6z" fill="#FF8A00" />
      <path d="m27 31 3 3 6-7" stroke="#7A43C7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
