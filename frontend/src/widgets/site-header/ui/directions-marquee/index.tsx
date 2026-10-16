"use client";

import Link from "next/link";
import Marquee from "react-fast-marquee";
import { HEADER_DIRECTIONS } from "../../config/navigation";
import { DirectionIcon } from "../direction-icon";
import styles from "./style.module.scss";

/** Прокручивает ссылки на направления и останавливает движение при наведении. */
export function DirectionsMarquee() {
  return (
    <div className={styles.strip}>
      <Marquee
        speed={45}
        gradient={false}
        pauseOnHover
        autoFill
      >
        {HEADER_DIRECTIONS.map((direction) => (
          <Link
            key={direction.href}
            href={direction.href}
            className={styles.item}
          >
            <DirectionIcon
              name={direction.icon}
              className={styles.icon}
            />
            <span>{direction.label}</span>
            <span
              className={styles.dot}
              aria-hidden="true"
            />
          </Link>
        ))}
      </Marquee>
    </div>
  );
}
