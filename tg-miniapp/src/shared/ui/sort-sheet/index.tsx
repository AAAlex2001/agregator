import cn from "classnames";
import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { CheckIcon, SortAscIcon, SortDescIcon } from "@/shared/ui/icons/interface";
import { tapHaptic } from "@/shared/services/telegram";
import s from "./style.module.scss";

export interface SortChoice {
  key: string;
  dir: "asc" | "desc";
  label: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  choices: SortChoice[];
  value: SortChoice;
  onSelect: (choice: SortChoice) => void;
}

export function SortSheet({ open, onClose, choices, value, onSelect }: Props) {
  return (
    <BottomSheet open={open} title="Сортировка" onClose={onClose}>
      {choices.map((choice) => {
        const on = choice.key === value.key && choice.dir === value.dir;
        return (
          <button
            key={`${choice.key}:${choice.dir}`}
            type="button"
            className={cn(s.item, { [s.active]: on })}
            onClick={() => {
              tapHaptic();
              onSelect(choice);
              onClose();
            }}
          >
            <span className={s.dir}>
              {choice.dir === "desc" ? <SortDescIcon width={16} height={16} /> : <SortAscIcon width={16} height={16} />}
            </span>
            <span className={s.name}>{choice.label}</span>
            {on && (
              <span className={s.check}>
                <CheckIcon width={18} height={18} />
              </span>
            )}
          </button>
        );
      })}
    </BottomSheet>
  );
}
