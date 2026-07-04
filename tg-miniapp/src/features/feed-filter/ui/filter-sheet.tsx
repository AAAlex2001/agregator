import cn from "classnames";
import { BottomSheet } from "@/shared/ui";
import { CheckIcon } from "@/shared/ui/icons/interface";
import { tapHaptic } from "@/shared/services/telegram";
import type { FeedView } from "../model/types";
import { VIEW_LABEL } from "../model/types";
import s from "./filter-sheet.module.scss";

const ALL_VIEWS: FeedView[] = ["orders", "responses", "archive"];

interface Props {
  open: boolean;
  view: FeedView;
  onChangeView: (view: FeedView) => void;
  onClose: () => void;
  views?: FeedView[];
  labels?: Partial<Record<FeedView, string>>;
}

export function FilterSheet({ open, view, onChangeView, onClose, views = ALL_VIEWS, labels }: Props) {
  return (
    <BottomSheet open={open} title="Фильтрация заказов" onClose={onClose}>
      {views.map((code) => (
        <button
          key={code}
          type="button"
          className={cn(s.item, { [s.active]: code === view })}
          onClick={() => {
            tapHaptic();
            onChangeView(code);
            onClose();
          }}
        >
          <span className={s.name}>{labels?.[code] ?? VIEW_LABEL[code]}</span>
          {code === view && (
            <span className={s.check}>
              <CheckIcon width={18} height={18} />
            </span>
          )}
        </button>
      ))}
    </BottomSheet>
  );
}
