import cn from "classnames";
import { BottomSheet } from "@/shared/ui";
import { CheckIcon } from "@/shared/ui/icons/interface";
import { tapHaptic } from "@/shared/services/telegram";
import type { ResponseTab } from "@/entites/response";
import type { FeedView } from "../model/types";
import { VIEW_LABEL } from "../model/types";
import s from "./filter-sheet.module.scss";

const VIEWS: FeedView[] = ["orders", "archive", "responses"];

const STATUS_OPTIONS: { code: ResponseTab; label: string }[] = [
  { code: "all", label: "Все" },
  { code: "review", label: "На рассмотрении" },
  { code: "in_progress", label: "В работе" },
  { code: "rejected", label: "Отклонённые" },
  { code: "accepted", label: "В переговорах" },
  { code: "withdrawn_by_expert", label: "Отозванные мной" },
];

interface Props {
  open: boolean;
  view: FeedView;
  respTab: ResponseTab;
  onChangeView: (view: FeedView) => void;
  onChangeRespTab: (tab: ResponseTab) => void;
  onClose: () => void;
}

export function FilterSheet({ open, view, respTab, onChangeView, onChangeRespTab, onClose }: Props) {
  return (
    <BottomSheet open={open} title="Фильтр" onClose={onClose}>
      <p className={s.group}>Раздел</p>
      {VIEWS.map((code) => (
        <button
          key={code}
          type="button"
          className={cn(s.item, { [s.active]: code === view })}
          onClick={() => {
            tapHaptic();
            onChangeView(code);
            if (code !== "responses") onClose();
          }}
        >
          <span className={s.name}>{VIEW_LABEL[code]}</span>
          {code === view && (
            <span className={s.check}>
              <CheckIcon width={18} height={18} />
            </span>
          )}
        </button>
      ))}

      {view === "responses" && (
        <>
          <p className={s.group}>Статус отклика</p>
          {STATUS_OPTIONS.map((o) => (
            <button
              key={o.code}
              type="button"
              className={cn(s.item, { [s.active]: o.code === respTab })}
              onClick={() => {
                tapHaptic();
                onChangeRespTab(o.code);
                onClose();
              }}
            >
              <span className={s.name}>{o.label}</span>
              {o.code === respTab && (
                <span className={s.check}>
                  <CheckIcon width={18} height={18} />
                </span>
              )}
            </button>
          ))}
        </>
      )}
    </BottomSheet>
  );
}
