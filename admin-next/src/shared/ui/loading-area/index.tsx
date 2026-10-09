import cn from "classnames";
import type { ReactNode } from "react";
import Loader from "@/shared/ui/loader";
import styles from "./style.module.scss";

type LoadingAreaProps = {
  loading: boolean;
  children: ReactNode;
  className?: string;
};

/** Блок, который на время перезагрузки бледнеет и показывает лоадер по центру экрана. */
const LoadingArea = ({ loading, children, className }: LoadingAreaProps) => (
  <div className={cn(styles.area, loading && styles.loading, className)} aria-busy={loading}>
    {children}
    {loading && <Loader size="lg" className={styles.loader} />}
  </div>
);

export default LoadingArea;
