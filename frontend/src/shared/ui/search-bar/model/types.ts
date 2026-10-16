import type { FocusEvent, KeyboardEvent, ReactNode } from "react";

/** Подсказка поиска с названием и необязательной дополнительной строкой. */
export interface SearchBarSuggestion {
  id: string | number;
  title: string;
  subtitle?: string;
}

/** Управляемая строка поиска и состояние списка подсказок. */
export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  buttonLabel?: string;
  suggestions?: SearchBarSuggestion[];
  activeSuggestionIndex?: number;
  onSuggestionHover?: (index: number) => void;
  onSuggestionPick?: (suggestion: SearchBarSuggestion) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLInputElement>) => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  showDropdown?: boolean;
  isLoading?: boolean;
  emptyLabel?: string;
  loadingLabel?: string;
  logo?: ReactNode;
}
