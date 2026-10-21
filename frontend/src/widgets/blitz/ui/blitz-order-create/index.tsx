import { CreateBlitzOrderForm } from "@/features/create-blitz-order";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Что будет после подачи заявки. */
const CREATE_SUBTITLE = "Заявку получат эксперты с подходящими удостоверениями. "
  + "Первый, кто согласится с ценой, подготовит договор — оплата по этапам";

/** Страница новой заявки. */
export function BlitzOrderCreate() {
  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <Title
          as="h1"
          text="Новая заявка на экспертизу"
        />
        <Subtitle text={CREATE_SUBTITLE} />
      </div>
      <CreateBlitzOrderForm />
    </div>
  );
}
