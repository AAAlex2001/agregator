import { tapHaptic } from "@/shared/services/telegram";
import { CloseIcon } from "@/shared/ui/icons/interface";
import type { ExpertPickerItem } from "@/entites/expert";
import { useExpertSearch } from "../model/use-expert-search";
import s from "./expert-picker.module.scss";

interface Props {
  selected: ExpertPickerItem[];
  onAdd: (expert: ExpertPickerItem) => void;
  onRemove: (id: number) => void;
}

export function ExpertPicker({ selected, onAdd, onRemove }: Props) {
  const search = useExpertSearch();

  const pick = (expert: ExpertPickerItem) => {
    tapHaptic();
    onAdd(expert);
    search.clear();
  };

  return (
    <div className={s.wrap}>
      <div className={s.suggestWrap}>
        <input
          className={s.input}
          placeholder="Поиск эксперта по имени…"
          value={search.query}
          onChange={(e) => search.setQuery(e.target.value)}
          onFocus={() => search.results.length > 0 && search.setOpen(true)}
        />
        {search.open && search.results.length > 0 && (
          <ul className={s.dropdown}>
            {search.results.map((expert) => (
              <li key={expert.id}>
                <button type="button" className={s.option} onClick={() => pick(expert)}>
                  <span className={s.optionName}>{expert.full_name}</span>
                  {expert.rating !== null && <span className={s.optionRating}>★ {expert.rating.toFixed(1)}</span>}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selected.length > 0 && (
        <div className={s.chips}>
          {selected.map((expert) => (
            <span key={expert.id} className={s.chip}>
              <span className={s.chipName}>{expert.full_name}</span>
              <button
                type="button"
                className={s.chipRemove}
                onClick={() => {
                  tapHaptic();
                  onRemove(expert.id);
                }}
                aria-label="Убрать эксперта"
              >
                <CloseIcon width={12} height={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
