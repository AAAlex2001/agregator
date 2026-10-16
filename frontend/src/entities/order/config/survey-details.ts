import type { OrderDetailOption } from "../model/detail-option";

/** Названия видов изысканий, сохранённых в заказе. */
export const SURVEY_KINDS: OrderDetailOption[] = [
  {
    value: "IGI",
    label: "Инженерно-геологические изыскания",
  },
  {
    value: "IGDI",
    label: "Инженерно-геодезические изыскания",
  },
  {
    value: "IGMI",
    label: "Гидрометеорологические изыскания",
  },
  {
    value: "IEI",
    label: "Инженерно-экологические изыскания",
  },
  {
    value: "IGFI",
    label: "Инженерно-геофизические изыскания",
  },
  {
    value: "ARCH",
    label: "Археологические исследования",
  },
];
