type Props = { size?: number };

const BODY =
  "M92.8545 38.5835H103.167C104.272 38.5835 105.332 39.0225 106.113 39.8039C106.895 40.5853 107.334 41.6451 107.334 42.7502V111.5C107.334 112.605 106.895 113.665 106.113 114.446C105.332 115.228 104.272 115.667 103.167 115.667H44.8337C43.7286 115.667 42.6688 115.228 41.8874 114.446C41.106 113.665 40.667 112.605 40.667 111.5V42.7502C40.667 41.6451 41.106 40.5853 41.8874 39.8039C42.6688 39.0225 43.7286 38.5835 44.8337 38.5835H59.417V44.8335H88.5837V38.5835H92.8545Z";

const TAB = "M88.5837 44.8337V32.3337H78.167L74.0003 28.167L69.8337 32.3337H59.417V44.8337H88.5837Z";

export function EmptyOrdersIcon({ size = 148 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 148 148" fill="none" aria-hidden="true">
      <g opacity="0.4">
        <rect width="148" height="148" rx="74" fill="#FFDDA9" fillOpacity="0.5" />
        <path d={BODY} fill="white" />
        <path d={BODY} stroke="white" strokeWidth="5" strokeLinejoin="round" />
        <path d={BODY} stroke="#FF8A00" strokeOpacity="0.8" strokeWidth="5" strokeLinejoin="round" />
        <path d={TAB} fill="white" />
        <path d={TAB} stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d={TAB} stroke="#FF8A00" strokeOpacity="0.8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M59.417 59.417H88.5837" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M59.417 59.417H88.5837" stroke="#FF8A00" strokeOpacity="0.8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M88.5837 71.917H59.417" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M88.5837 71.917H59.417" stroke="#FF8A00" strokeOpacity="0.8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M88.5837 84.417H59.417" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M88.5837 84.417H59.417" stroke="#FF8A00" strokeOpacity="0.8" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M104 121C112.284 121 119 114.284 119 106C119 97.7157 112.284 91 104 91C95.7157 91 89 97.7157 89 106C89 114.284 95.7157 121 104 121Z"
          fill="#FF8A00"
        />
        <path
          d="M99.002 100.998L109.002 110.998M109.002 100.998L99.002 110.998"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
