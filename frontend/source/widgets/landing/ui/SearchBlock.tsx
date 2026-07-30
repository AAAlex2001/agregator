import { OrderSearchBar } from "@/source/features/order-search";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import s from "./search-block.module.scss";

const SearchBlock = () => (
  <section className={s.section} id="search">
    <div className={s.content}>
      <header className={s.header}>
        <Title text="Все заказы на одной площадке" />
        <Subtitle text="Найдите проект по наименованию работы или наименованию организации(заказчика) — покажем все актуальные и архивные заказы платформы" />
      </header>
      <div className={s.bar}>
        <OrderSearchBar />
      </div>
    </div>
  </section>
);

export default SearchBlock;
