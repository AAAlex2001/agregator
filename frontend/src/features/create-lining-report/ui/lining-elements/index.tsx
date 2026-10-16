import type { LiningCatalog, LiningElementCategories } from "@/entities/lining";
import { Checkbox } from "@/shared/ui/checkbox";
import styles from "./style.module.scss";

/** Справочник элементов, выбранные категории и выбор новой категории. */
interface LiningElementsProps {
  catalog: LiningCatalog;
  categories: LiningElementCategories;
  onSelect: (elementId: number, category: number) => void;
}

/** Категории технического состояния элементов крепи по группам параметров. */
export function LiningElements({ catalog, categories, onSelect }: LiningElementsProps) {
  const groups = Object.entries(catalog.element_group_titles);

  return (
    <div className={styles.section}>
      <p className={styles.hint}>
        Выберите категорию технического состояния (1 — нормальное, 5 — аварийное) для каждого
        элемента крепи.
      </p>
      {groups.map(([group, title]) => (
        <div
          key={group}
          className={styles.group}
        >
          <h4 className={styles.title}>{title}</h4>
          <div className={styles.elements}>
            {catalog.elements
              .filter((element) => element.group === group)
              .map((element) => (
                <div
                  key={element.id}
                  className={styles.element}
                >
                  <span className={styles.name}>{element.name}</span>
                  <div className={styles.options}>
                    {catalog.damage_categories.map((category) => (
                      <Checkbox
                        key={category.id}
                        id={`el-${element.id}-${category.id}`}
                        checked={categories[element.id] === category.id}
                        onChange={() => onSelect(element.id, category.id)}
                      >
                        {category.id}. {category.description.split(/[.,]/)[0]}
                      </Checkbox>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
