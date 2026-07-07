import { Subtitle, Title } from "@/source/shared/ui";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { REGISTRIES } from "../model/registries";
import s from "./ZepbRegistryWidget.module.scss";

export function ZepbRegistryWidget() {
  return (
    <div className={s.wrapper}>
      <Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: "Реестр заключений ЭПБ" }]} />
      <header className={s.head}>
        <Title as="h1" text="Реестры заключений ЭПБ Ростехнадзора" />
        <Subtitle text="Сведения из реестров заключений экспертизы промышленной безопасности по территориальным управлениям Ростехнадзора" />
      </header>

      <div className={s.scroll}>
        <table className={s.table}>
          <thead>
            <tr>
              <th className={s.th}>Управление</th>
              <th className={s.th}>Ссылка на реестр зЭПБ</th>
            </tr>
          </thead>
          <tbody>
            {REGISTRIES.map((row) => (
              <tr key={row.site}>
                <td className={`${s.td} ${s.tdName}`}>
                  <span className={s.name}>{row.name}</span>
                  <span className={s.site}>{row.site}</span>
                </td>
                <td className={s.td}>
                  <a className={s.link} href={row.url} target="_blank" rel="noopener noreferrer">
                    {row.url}
                  </a>
                  <p className={s.note}>{row.note}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
