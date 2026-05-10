import { OrderSearchBar } from "@/source/features/order-search";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import s from "./search-block.module.scss";

const SearchBlock = () => (
  <section className={s.section} id="search">
    <div className={s.content}>
      <header className={s.header}>
        <Title
          text="Все заказы по экспертизе промышленной безопасности на одной площадке"
          className={s.title}
        />
        <Subtitle
          text="Найдите свой проект по названию или организации — покажем все актуальные и архивные заказы платформы"
          className={s.subtitle}
        />
      </header>
      <div className={s.bar}>
        <OrderSearchBar />
      </div>
    </div>
  </section>
);

export default SearchBlock;
