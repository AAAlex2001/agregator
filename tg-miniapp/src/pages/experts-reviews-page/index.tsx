import { useState } from "react";
import { Screen } from "@/widgets/app-shell";
import { SortSheet, Spinner, type SortChoice } from "@/shared/ui";
import { SortIcon } from "@/shared/ui/icons/interface";
import { tapHaptic } from "@/shared/services/telegram";
import { ExpertCard, type ExpertSortBy, type ExpertSummary } from "@/entites/expert";
import { ExpertReviewsSheet, useExpertsList } from "@/features/expert-reviews";
import s from "./style.module.scss";

const EXPERT_SORTS: SortChoice[] = [
  { key: "rating", dir: "desc", label: "Рейтинг — сначала выше" },
  { key: "rating", dir: "asc", label: "Рейтинг — сначала ниже" },
  { key: "completed_orders", dir: "desc", label: "Заказы — сначала больше" },
  { key: "completed_orders", dir: "asc", label: "Заказы — сначала меньше" },
  { key: "review_count", dir: "desc", label: "Отзывы — сначала больше" },
  { key: "review_count", dir: "asc", label: "Отзывы — сначала меньше" },
];

export function ExpertsReviewsPage() {
  const [sort, setSort] = useState<SortChoice>(EXPERT_SORTS[0]);
  const [sortOpen, setSortOpen] = useState(false);
  const [selected, setSelected] = useState<ExpertSummary | null>(null);
  const { items } = useExpertsList(sort.key as ExpertSortBy, sort.dir);

  return (
    <Screen bare heading="Отзывы экспертов" panel>
      <div className={s.wrap}>
        <div className={s.head}>
          <p className={s.sub}>Аттестованные эксперты платформы — отзывы заказчиков по завершённым заказам</p>
          <button
            className={s.sortBtn}
            aria-label="Сортировка"
            onClick={() => {
              tapHaptic();
              setSortOpen(true);
            }}
          >
            <SortIcon width={20} height={20} />
          </button>
        </div>

        {items === null ? (
          <div className={s.loading}>
            <Spinner />
          </div>
        ) : items.length === 0 ? (
          <p className={s.empty}>Пока нет экспертов с отзывами</p>
        ) : (
          <div className={s.list}>
            {items.map((expert) => (
              <ExpertCard key={expert.public_id} expert={expert} onClick={() => setSelected(expert)} />
            ))}
          </div>
        )}
      </div>

      <SortSheet
        open={sortOpen}
        onClose={() => setSortOpen(false)}
        choices={EXPERT_SORTS}
        value={sort}
        onSelect={setSort}
      />

      <ExpertReviewsSheet expert={selected} onClose={() => setSelected(null)} />
    </Screen>
  );
}
