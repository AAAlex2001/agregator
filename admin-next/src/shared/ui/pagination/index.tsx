import IconButton from "@/shared/ui/icon-button";
import { ChevronLeftIcon, ChevronRightIcon } from "@/shared/ui/icons";
import styles from "./style.module.scss";

type PaginationProps = {
  page: number;
  pages: number;
  onChange: (page: number) => void;
  disabled?: boolean;
};

/** Листалка «Страница N из X». Не показывается, если страница одна. */
const Pagination = ({ page, pages, onChange, disabled }: PaginationProps) => {
  if (pages <= 1) return null;

  return (
    <nav className={styles.pagination} aria-label="Страницы">
      <IconButton ariaLabel="Предыдущая страница" disabled={disabled || page <= 1} onClick={() => onChange(page - 1)}>
        <ChevronLeftIcon />
      </IconButton>

      <span className={styles.label}>
        Страница {page} из {pages}
      </span>

      <IconButton ariaLabel="Следующая страница" disabled={disabled || page >= pages} onClick={() => onChange(page + 1)}>
        <ChevronRightIcon />
      </IconButton>
    </nav>
  );
};

export default Pagination;
