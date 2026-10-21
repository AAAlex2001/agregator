import { CreateBlitzAuditForm } from "@/features/create-blitz-audit";
import { Subtitle } from "@/shared/ui/subtitle";
import { Title } from "@/shared/ui/title";
import styles from "./style.module.scss";

/** Что будет после подачи заявки. */
const CREATE_SUBTITLE = "Заявку получат руководители аудиторских групп. Аудитор возьмёт её "
  + "по вашей цене или предложит свою; после договора и аванса — План аудита и проверка документов";

/** Страница новой заявки на аудит СУПБ. */
export function BlitzAuditCreate() {
  return (
    <div className={styles.page}>
      <div className={styles.head}>
        <Title
          as="h1"
          text="Новая заявка на аудит СУПБ"
        />
        <Subtitle text={CREATE_SUBTITLE} />
      </div>
      <CreateBlitzAuditForm />
    </div>
  );
}