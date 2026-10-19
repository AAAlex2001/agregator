import type {
  LinkPreview,
  TelegramButton,
  TelegramButtonKind,
  TelegramButtonStyle,
  TelegramOptions,
  TelegramPoll,
} from "@/entities/post";
import type { SelectOption } from "@/shared/ui/select";

/** Сколько рядов кнопок и кнопок в ряду принимает сервер. */
export const MAX_BUTTON_ROWS = 8;
export const MAX_BUTTONS_IN_ROW = 3;

/** Сколько вариантов может быть в опросе. */
export const MIN_POLL_OPTIONS = 2;
export const MAX_POLL_OPTIONS = 10;

/** Настройки нового Telegram-поста. */
export const DEFAULT_TELEGRAM_OPTIONS: TelegramOptions = {
  silent: false,
  protect: false,
  pin: false,
  link_preview: "auto",
  link_preview_above: false,
  caption_above: false,
  auto_delete_hours: null,
  buttons: [],
  poll: null,
};

/** Новая кнопка: ссылка без текста. */
export const EMPTY_BUTTON: TelegramButton = {
  kind: "url",
  text: "",
  value: "",
  alt: "",
  style: null,
};

/** Новый опрос с двумя пустыми вариантами. */
export const EMPTY_POLL: TelegramPoll = {
  question: "",
  options: ["", ""],
  is_anonymous: true,
  allows_multiple_answers: false,
};

/** Превью ссылок в тексте. */
export const LINK_PREVIEW_OPTIONS: SelectOption[] = [
  { value: "auto", label: "Как решит Telegram" },
  { value: "off", label: "Без превью" },
  { value: "small", label: "Маленькое" },
  { value: "large", label: "Большое" },
];

/** Через сколько удалить пост из каналов; пустое значение — не удалять. */
export const AUTO_DELETE_OPTIONS: SelectOption[] = [
  { value: "", label: "Не удалять" },
  { value: "1", label: "Через 1 час" },
  { value: "6", label: "Через 6 часов" },
  { value: "24", label: "Через сутки" },
  { value: "48", label: "Через 2 суток" },
  { value: "168", label: "Через неделю" },
];

/** Что делает кнопка. */
export const BUTTON_KIND_OPTIONS: SelectOption[] = [
  { value: "url", label: "Ссылка" },
  { value: "copy", label: "Скопировать текст" },
  { value: "hidden", label: "Скрытый текст для подписчиков" },
];

/** Цвет кнопки; пустое значение — обычная. */
export const BUTTON_STYLE_OPTIONS: SelectOption[] = [
  { value: "", label: "Обычная" },
  { value: "primary", label: "Синяя" },
  { value: "success", label: "Зелёная" },
  { value: "danger", label: "Красная" },
];

/** Варианты превью ссылок в порядке списка. */
export const LINK_PREVIEWS: LinkPreview[] = ["auto", "off", "small", "large"];

/** Виды кнопок в порядке списка. */
export const BUTTON_KINDS: TelegramButtonKind[] = ["url", "copy", "hidden"];

/** Цвета кнопок; обычная — без цвета. */
export const BUTTON_STYLES: TelegramButtonStyle[] = ["primary", "success", "danger"];
