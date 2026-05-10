import { OrderSearchBar } from "@/source/features/order-search";
import s from "./search-block.module.scss";

const SearchBlock = () => (
  <section className={s.section}>
    <OrderSearchBar />
  </section>
);

export default SearchBlock;
