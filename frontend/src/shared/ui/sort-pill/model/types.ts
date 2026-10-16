/** Направление сортировки выбранного поля. */
export type SortDirection = "asc" | "desc";

/** Подписи и управляемое состояние одной кнопки сортировки. */
export interface SortPillProps {
  label: string;
  ascLabel: string;
  descLabel: string;
  isActive: boolean;
  isOpen: boolean;
  sortDir: SortDirection | null;
  onToggle: () => void;
  onClose: () => void;
  onChange: (direction: SortDirection | null) => void;
}
