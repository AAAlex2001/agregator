import { OrderSearchBar } from "@/source/features/order-search";
import { Title, Subtitle } from "@/source/shared/ui/Typography";
import s from "./search-block.module.scss";

const SearchBlock = () => (
  <section className={s.section} id="search">
    <div className={s.content}>
      <header className={s.header}>
        <Title text="Найдите свой проект" />
        <Subtitle text="Введите название заказа или организации — покажем все подходящие" />
      </header>
      <div className={s.bar}>
        <OrderSearchBar />
      </div>
    </div>
  </section>
);

export default SearchBlock;
