import type { ReactNode } from "react";
import type { DirectionCode } from "@/entities/direction";
import styles from "./style.module.scss";

/** Направление оформления и содержимое публичной или кабинетной страницы. */
interface ServicePageProps {
  direction: DirectionCode;
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

/** Сохраняет общую оболочку, отступы и цветовую тему страниц направлений. */
export function ServicePage({
  direction,
  children,
  header,
  footer,
}: ServicePageProps) {
  return (
    <div
      className={styles.page}
      data-direction={direction}
    >
      {header}
      <main>{children}</main>
      {footer}
    </div>
  );
}
