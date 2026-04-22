export type DocTableBlock = {
  kind: "table";
  headers: string[];
  rows: string[][];
};

export type DocBlock =
  | { kind: "row"; num: string; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "group"; variant?: "default" | "tight"; children: DocBlock[] }
  | { kind: "bulletSection"; num: string; items: Array<{ text: string; subitems?: string[] }> }
  | DocTableBlock;

export type DocSection = {
  id: string;
  title?: string;
  blocks: DocBlock[];
};
