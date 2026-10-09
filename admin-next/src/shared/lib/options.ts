export type Option = {
  value: string;
  label: string;
};

/** Варианты для выпадающего списка из словаря подписей. */
export const toOptions = (labels: Record<string, string>): Option[] =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

/** Те же варианты с пунктом «все» первым — для фильтров списков. */
export const withAllOption = (labels: Record<string, string>, allLabel: string): Option[] => [
  { value: "", label: allLabel },
  ...toOptions(labels),
];
