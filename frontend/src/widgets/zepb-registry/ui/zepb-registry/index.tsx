import cn from "classnames";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import { ZEPB_REGISTRIES } from "../../config/registries";
import styles from "./style.module.scss";

/** Путь к главной в текущем разделе сайта. */
interface ZepbRegistryProps {
  homeHref: string;
}

/** Таблица ссылок на реестры заключений ЭПБ территориальных управлений Ростехнадзора. */
export function ZepbRegistry({ homeHref }: ZepbRegistryProps) {
  return (
    <div className={styles.wrapper}>
      <Breadcrumbs
        items={[
          { label: "Главная", href: homeHref },
          { label: "Реестр заключений ЭПБ" },
        ]}
      />
      <header className={styles.head}>
        <Title
          as="h1"
          text="Реестры заключений ЭПБ Ростехнадзора"
        />
        <Subtitle
          text="Сведения из реестров заключений экспертизы промышленной безопасности по территориальным управлениям Ростехнадзора"
        />
      </header>

      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Управление</th>
              <th className={styles.th}>Ссылка на реестр зЭПБ</th>
            </tr>
          </thead>
          <tbody>
            {ZEPB_REGISTRIES.map((registry) => (
              <tr key={registry.site}>
                <td className={cn(styles.td, styles.tdName)}>
                  <span className={styles.name}>{registry.name}</span>
                  <span className={styles.site}>{registry.site}</span>
                </td>
                <td className={styles.td}>
                  <a
                    className={styles.link}
                    href={registry.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {registry.url}
                  </a>
                  <p className={styles.note}>{registry.note}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
