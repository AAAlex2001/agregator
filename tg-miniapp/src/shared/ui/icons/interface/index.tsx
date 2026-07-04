import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const MailIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="m4 7 8 6 8-6" />
  </svg>
);

export const LockIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="4" y="10" width="16" height="11" rx="2.5" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

export const EyeIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const EyeOffIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M3 3l18 18" />
    <path d="M10.6 10.6a3 3 0 0 0 4.2 4.2" />
    <path d="M9.9 5.2A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a16.9 16.9 0 0 1-3.3 4.1M6.2 6.2A16.6 16.6 0 0 0 2 12s3.5 7 10 7a10.2 10.2 0 0 0 3-.5" />
  </svg>
);

export const ChevronDownIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const ChevronRightIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
);

export const UserIcon = (p: P) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="8" r="4" />
    <path d="M5 21a7 7 0 0 1 14 0" />
  </svg>
);

export const PlusIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const DocIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" />
  </svg>
);

export const MoonIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
  </svg>
);

export const CreditIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="3" />
    <path d="M3 10h18M7 15h4" />
  </svg>
);

export const CloseIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);

export const PhoneIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
  </svg>
);

export const BellIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
  </svg>
);

export const VibrateIcon = (p: P) => (
  <svg {...base} {...p}>
    <rect x="8" y="4" width="8" height="16" rx="2" />
    <path d="M3 9v6M21 9v6" />
  </svg>
);

export const LogoutIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5M21 12H9" />
  </svg>
);

export const CheckIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m5 12 5 5L20 7" />
  </svg>
);

export const UploadIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    <path d="M12 15V4M8 8l4-4 4 4" />
  </svg>
);

export const FilterIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="M22 4H2l8 9.46V19l4 2v-7.54L22 4z" />
  </svg>
);

export const ReviewStarIcon = ({ active = false, ...p }: P & { active?: boolean }) => (
  <svg width={18} height={18} viewBox="0 0 32 32" fill="none" {...p}>
    <path
      d="M15.9991 23.1115L21.5325 26.4581C22.5458 27.0715 23.7858 26.1648 23.5191 25.0181L22.0525 18.7248L26.9458 14.4848C27.8391 13.7115 27.3591 12.2448 26.1858 12.1515L19.7458 11.6048L17.2258 5.65814C16.7725 4.57814 15.2258 4.57814 14.7725 5.65814L12.2525 11.5915L5.81245 12.1381C4.63912 12.2315 4.15912 13.6981 5.05245 14.4715L9.94579 18.7115L8.47912 25.0048C8.21245 26.1515 9.45245 27.0581 10.4658 26.4448L15.9991 23.1115Z"
      fill={active ? "#FFB800" : "#D9D9D9"}
    />
  </svg>
);

export const ReviewsIcon = (p: P) => (
  <svg {...base} {...p}>
    <path d="m12 3.4 2.6 5.27 5.82.85-4.21 4.1.99 5.8L12 16.68l-5.2 2.74.99-5.8-4.21-4.1 5.82-.85L12 3.4Z" />
  </svg>
);

export const SortIcon = (p: P) => (
  <svg {...base} viewBox="0 0 16 16" strokeWidth={1.4} {...p}>
    <path d="M7.3335 10.6667L5.3335 12.6667L3.3335 10.6667" />
    <path d="M8.6665 5.33333L10.6665 3.33333L12.6665 5.33333" />
    <path d="M10.6665 12.6667L10.6665 3.33333" />
    <path d="M5.3335 3.33333V12.6667" />
  </svg>
);

export const SortAscIcon = (p: P) => (
  <svg {...base} viewBox="0 0 16 16" strokeWidth={1.4} {...p}>
    <path d="M2.6665 11.3333H6.6665" />
    <path d="M2.6665 8H8.6665" />
    <path d="M12 7.33334L12 12.6667" />
    <path d="M14 10.6667L12 12.6667L10 10.6667" />
    <path d="M2.6665 4.66666H10.6665" />
  </svg>
);

export const SortDescIcon = (p: P) => (
  <svg {...base} viewBox="0 0 16 16" strokeWidth={1.4} {...p}>
    <path d="M2.6665 11.3333L10.6665 11.3333" />
    <path d="M2.6665 8H8.6665" />
    <path d="M2.6665 4.66666H6.6665" />
    <path d="M12 8.66666L12 3.33333" />
    <path d="M14 5.33333L12 3.33333L10 5.33333" />
  </svg>
);

export const CrownIcon = (p: P) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...p}
  >
    <path d="M3 9.5 6.8 12 12 5 17.2 12 21 9.5 19.3 18.5H4.7L3 9.5Z" />
    <path d="M4.7 21.5H19.3" />
    <circle cx="3" cy="9.5" r="1.05" />
    <circle cx="12" cy="5" r="1.05" />
    <circle cx="21" cy="9.5" r="1.05" />
  </svg>
);
