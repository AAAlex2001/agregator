/** Дополнительный CSS-класс для декоративного маркера списка. */
interface BulletIconProps {
  className?: string;
}

/** Показывает небольшой ромб с основным градиентом сайта. */
export function BulletIcon({ className }: BulletIconProps) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 7C9.84844 7 9.69689 7.05414 9.57781 7.17325L7.17456 9.57704C6.94181 9.80984 6.94181 10.1888 7.17456 10.4216L9.57781 12.8254C9.81056 13.0582 10.1894 13.0582 10.4222 12.8254L12.8254 10.4216C13.0582 10.1888 13.0582 9.80984 12.8254 9.57704L10.4222 7.17325C10.3031 7.05414 10.1516 7 10 7Z"
        fill="url(#paint0_linear_bullet)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_bullet"
          x1="7"
          y1="10"
          x2="13"
          y2="10"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--color-orange-bright)" />
          <stop
            offset="1"
            stopColor="var(--color-orange-primary)"
          />
        </linearGradient>
      </defs>
    </svg>
  );
}
