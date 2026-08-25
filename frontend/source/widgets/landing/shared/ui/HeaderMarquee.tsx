"use client";

import Link from "next/link";
import Marquee from "react-fast-marquee";
import s from "./header-marquee.module.scss";

const icon = (paths: React.ReactNode) => (
  <svg
    className={s.icon}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.7"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {paths}
  </svg>
);

const HelmetIcon = icon(
  <>
    <path d="M3 17a9 9 0 0 1 18 0" />
    <path d="M9 17V8a3 3 0 0 1 6 0v9" />
    <path d="M2 17h20v2H2z" />
  </>,
);

const ShieldIcon = icon(
  <>
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
    <path d="M9 12l2 2 4-4" />
  </>,
);

const GaugeIcon = icon(
  <>
    <path d="M4 18a8 8 0 1 1 16 0" />
    <path d="M12 18l4-5" />
    <path d="M2 18h20" />
  </>,
);

const RulerIcon = icon(
  <>
    <path d="M4 20L20 4" />
    <path d="M6 14l3 3" />
    <path d="M10 10l3 3" />
    <path d="M14 6l3 3" />
    <path d="M3 21h6v-6z" />
  </>,
);

const CompassIcon = icon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5z" />
  </>,
);

const LeafIcon = icon(
  <>
    <path d="M20 4c0 9-5 13-11 13a5 5 0 0 1 0-10c5 0 8-1 11-3z" />
    <path d="M4 20c2-4 5-7 9-9" />
  </>,
);

const FlaskIcon = icon(
  <>
    <path d="M10 3h4" />
    <path d="M11 3v6L5 19a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-6-10V3" />
    <path d="M8 15h8" />
  </>,
);

const MapIcon = icon(
  <>
    <path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" />
    <path d="M9 4v14" />
    <path d="M15 6v14" />
  </>,
);

const ScalesIcon = icon(
  <>
    <path d="M12 4v16" />
    <path d="M6 20h12" />
    <path d="M4 8h16" />
    <path d="M7 8l-3 6h6z" />
    <path d="M17 8l-3 6h6z" />
  </>,
);

const ITEMS = [
  { href: "/ekspertiza-promyshlennoy-bezopasnosti", label: "Экспертиза промышленной безопасности", icon: HelmetIcon },
  { href: "/audit-supb", label: "Аудит СУПБ", icon: ShieldIcon },
  { href: "/tehnicheskoe-diagnostirovanie", label: "Техническое диагностирование", icon: GaugeIcon },
  { href: "/proektirovanie", label: "Проектирование объектов", icon: RulerIcon },
  { href: "/inzhenernye-izyskaniya", label: "Инженерные изыскания", icon: CompassIcon },
  { href: "/ekologiya", label: "Экологическое сопровождение", icon: LeafIcon },
  { href: "/nir", label: "НИР и лабораторные исследования", icon: FlaskIcon },
  { href: "/kadastrovye-raboty", label: "Кадастровые работы", icon: MapIcon },
  { href: "/sudebnaya-ekspertiza", label: "Судебная экспертиза", icon: ScalesIcon },
];

const HeaderMarquee = () => (
  <div className={s.strip}>
    <Marquee speed={45} gradient={false} pauseOnHover autoFill>
      {ITEMS.map((item) => (
        <Link key={item.href} href={item.href} className={s.item}>
          {item.icon}
          <span>{item.label}</span>
          <span className={s.dot} aria-hidden="true" />
        </Link>
      ))}
    </Marquee>
  </div>
);

export default HeaderMarquee;
