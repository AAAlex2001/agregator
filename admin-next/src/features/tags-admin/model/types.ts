import type { Tag } from "@/entities/tag";

export type TagsState = {
  tags: Tag[] | null;
  failed: boolean;
  draft: string;
  editing: Tag | null;
  editingName: string;
  removing: Tag | null;
  pending: boolean;
};

export type TagsAction =
  | { type: "load/success"; tags: Tag[] }
  | { type: "load/error" }
  | { type: "draft/change"; value: string }
  | { type: "edit/open"; tag: Tag }
  | { type: "edit/change"; value: string }
  | { type: "edit/close" }
  | { type: "remove/ask"; tag: Tag }
  | { type: "remove/cancel" }
  | { type: "request/start" }
  | { type: "request/finish" }
  | { type: "tag/created"; tag: Tag }
  | { type: "tag/renamed"; tag: Tag }
  | { type: "tag/removed"; id: number };
