/** Таблица документа с заголовками и текстовыми ячейками. */
export interface DocumentTableBlock {
  kind: "table";
  headers: string[];
  rows: string[][];
}

/** Пункт списка с необязательными вложенными пояснениями. */
export interface DocumentListItem {
  text: string;
  subitems?: string[];
}

/** Абзац, нумерованный пункт, список, таблица или группа внутри документа. */
export type DocumentBlock =
  | {
      kind: "paragraph";
      text: string;
    }
  | {
      kind: "row";
      num: string;
      text: string;
    }
  | {
      kind: "group";
      variant?: "default" | "tight";
      children: DocumentBlock[];
    }
  | {
      kind: "bulletSection";
      num: string;
      items: DocumentListItem[];
    }
  | DocumentTableBlock;

/** Раздел документа с якорем для оглавления и последовательностью блоков. */
export interface DocumentSection {
  id: string;
  title?: string;
  blocks: DocumentBlock[];
}
