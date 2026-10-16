import cn from "classnames";
import styles from "./style.module.scss";

/** Светлый подвал: тёмный текст вместо белого. */
interface LegalNoticeProps {
  isLight: boolean;
}

/** Показывает основание аттестации экспертов и сведения о владельце платформы. */
export function LegalNotice({ isLight }: LegalNoticeProps) {
  return (
    <div
      className={cn(styles.bottom, {
        [styles.light]: isLight,
      })}
    >
      <div className={styles.bottomLinks}>
        <span>
          *Исполнители экспертизы промышленной безопасности имеют аттестацию Ростехнадзора
          согласно
          <a
            href="https://www.gosnadzor.ru/service/list/certification%20experts/%D0%9F%D1%80-287%20%D0%BE%D1%82%2031.08.2022.pdf?ysclid=mi265psds810889564"
            target="_blank"
            rel="noopener noreferrer"
            title="Открыть Приказ № 287 от 31.08.2022 г."
          >
            Приказу № 287 от 31.08.2022 г.
          </a>
        </span>
      </div>
      <span>© {new Date().getFullYear()} ООО «НПИ «Недра». Все права защищены.</span>
    </div>
  );
}
