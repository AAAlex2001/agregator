import {
  LawIcon,
  NormsIcon,
  PracticeIcon,
  SafetyIcon,
} from "@/shared/ui/icons";
import { CategoryCard } from "../category-card";
import styles from "./style.module.scss";

/** Четыре раздела фонда «Кодекс», пока поиск не запущен. */
export function TechExpertCategories() {
  return (
    <section className={styles.cards}>
      <CategoryCard
        icon={<NormsIcon />}
        title="Нормы и стандарты"
        description="ГОСТы, СНиПы, СП, СанПиН и другие нормативные документы"
      />
      <CategoryCard
        icon={<LawIcon />}
        title="Законодательство РФ"
        description="Федеральные законы, кодексы, постановления и приказы"
      />
      <CategoryCard
        icon={<SafetyIcon />}
        title="Промышленная безопасность"
        description="Правила, нормы и требования промышленной безопасности"
      />
      <CategoryCard
        icon={<PracticeIcon />}
        title="Судебная и экспертная практика"
        description="Судебные решения, экспертизы и разъяснения"
      />
    </section>
  );
}
