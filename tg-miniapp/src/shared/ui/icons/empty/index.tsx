import type { ReactNode } from "react";

type Props = { size?: number };

const ORDERS_BODY =
  "M92.8545 38.5835H103.167C104.272 38.5835 105.332 39.0225 106.113 39.8039C106.895 40.5853 107.334 41.6451 107.334 42.7502V111.5C107.334 112.605 106.895 113.665 106.113 114.446C105.332 115.228 104.272 115.667 103.167 115.667H44.8337C43.7286 115.667 42.6688 115.228 41.8874 114.446C41.106 113.665 40.667 112.605 40.667 111.5V42.7502C40.667 41.6451 41.106 40.5853 41.8874 39.8039C42.6688 39.0225 43.7286 38.5835 44.8337 38.5835H59.417V44.8335H88.5837V38.5835H92.8545Z";

const ORDERS_TAB = "M88.5837 44.8337V32.3337H78.167L74.0003 28.167L69.8337 32.3337H59.417V44.8337H88.5837Z";

const BUBBLE =
  "M54 44H94C100.627 44 106 49.3726 106 56V78C106 84.6274 100.627 90 94 90H72L58 104V90H54C47.3726 90 42 84.6274 42 78V56C42 49.3726 47.3726 44 54 44Z";

function Shape({ d, filled = true }: { d: string; filled?: boolean }) {
  return (
    <>
      {filled && <path d={d} fill="white" />}
      <path d={d} stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke="#FF8A00" strokeOpacity="0.8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

function Badge() {
  return (
    <>
      <path
        d="M104 121C112.284 121 119 114.284 119 106C119 97.7157 112.284 91 104 91C95.7157 91 89 97.7157 89 106C89 114.284 95.7157 121 104 121Z"
        fill="#FF8A00"
      />
      <path d="M99.002 100.998L109.002 110.998M109.002 100.998L99.002 110.998" stroke="white" strokeWidth="5" strokeLinecap="round" />
    </>
  );
}

function EmptyBase({ size, children }: { size: number; children: ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 148 148" fill="none" aria-hidden="true">
      <g opacity="0.4">
        <rect width="148" height="148" rx="74" fill="#FFDDA9" fillOpacity="0.5" />
        {children}
        <Badge />
      </g>
    </svg>
  );
}

export function EmptyOrdersIcon({ size = 148 }: Props) {
  return (
    <EmptyBase size={size}>
      <Shape d={ORDERS_BODY} />
      <Shape d={ORDERS_TAB} />
      <Shape d="M59.417 59.417H88.5837" filled={false} />
      <Shape d="M88.5837 71.917H59.417" filled={false} />
      <Shape d="M88.5837 84.417H59.417" filled={false} />
    </EmptyBase>
  );
}

export function EmptyResponsesIcon({ size = 148 }: Props) {
  return (
    <EmptyBase size={size}>
      <Shape d={BUBBLE} />
      <circle cx="61" cy="67" r="4" fill="#FF8A00" fillOpacity="0.8" />
      <circle cx="74" cy="67" r="4" fill="#FF8A00" fillOpacity="0.8" />
      <circle cx="87" cy="67" r="4" fill="#FF8A00" fillOpacity="0.8" />
    </EmptyBase>
  );
}

export function EmptyNewResponsesIcon({ size = 148 }: Props) {
  return (
    <EmptyBase size={size}>
      <Shape d="M74 34C61 34 53 45 53 59V75L45 88H103L95 75V59C95 45 87 34 74 34Z" />
      <Shape d="M66 97C66 101.418 69.5817 104 74 104C78.4183 104 82 101.418 82 97" filled={false} />
    </EmptyBase>
  );
}

export function EmptyInWorkIcon({ size = 148 }: Props) {
  return (
    <EmptyBase size={size}>
      <Shape d="M46 84C46 68.536 58.536 56 74 56C89.464 56 102 68.536 102 84H46Z" />
      <Shape d="M44 84H104C106.209 84 108 85.7909 108 88V90C108 92.2091 106.209 94 104 94H44C41.7909 94 40 92.2091 40 90V88C40 85.7909 41.7909 84 44 84Z" />
      <Shape d="M74 44V56" filled={false} />
    </EmptyBase>
  );
}

export function EmptyRejectedIcon({ size = 148 }: Props) {
  return (
    <EmptyBase size={size}>
      <Shape d={BUBBLE} />
      <Shape d="M65 58L83 76M83 58L65 76" filled={false} />
    </EmptyBase>
  );
}

export function EmptyAcceptedIcon({ size = 148 }: Props) {
  return (
    <EmptyBase size={size}>
      <Shape d="M50 42H84C89.5228 42 94 46.4772 94 52V64C94 69.5228 89.5228 74 84 74H50C44.4772 74 40 69.5228 40 64V52C40 46.4772 44.4772 42 50 42Z" />
      <Shape d="M72 66H98C103.523 66 108 70.4772 108 76V86C108 91.5228 103.523 96 98 96H90V108L78 96H72C66.4772 96 62 91.5228 62 86V76C62 70.4772 66.4772 66 72 66Z" />
    </EmptyBase>
  );
}

export function EmptyArchiveIcon({ size = 148 }: Props) {
  return (
    <EmptyBase size={size}>
      <Shape d="M44 60H104V102C104 106.418 100.418 110 96 110H52C47.5817 110 44 106.418 44 102V60Z" />
      <Shape d="M42 42H106C108.209 42 110 43.7909 110 46V56C110 58.2091 108.209 60 106 60H42C39.7909 60 38 58.2091 38 56V46C38 43.7909 39.7909 42 42 42Z" />
      <Shape d="M64 76H84" filled={false} />
    </EmptyBase>
  );
}
