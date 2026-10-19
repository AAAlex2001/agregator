import type { Editor } from "@tiptap/react";
import type { PostMedia } from "@/entities/post";

/** Просьба к ИИ-помощнику, идущий запрос и отправка просьбы для текста в редакторе. */
export interface AiAssistant {
  instruction: string;
  isPending: boolean;
  setInstruction: (instruction: string) => void;
  ask: (editor: Editor, request: string) => Promise<void>;
}

/** Как сохраняется публикация: черновиком или сразу в ленту. */
export type SaveMode = "draft" | "publish";

/** Куда пишется пост: в ленту сайта или в Telegram-каналы. */
export type PostTarget = "site" | "telegram";

/** Текст, файлы, где публиковать и идущие запросы формы публикации. */
export interface PostFormState {
  html: string;
  media: PostMedia[];
  onSite: boolean;
  channelIds: number[];
  isMediaBusy: boolean;
  savingMode: SaveMode | null;
}

/** Изменения формы публикации от полей и запросов. */
export type PostFormAction =
  | {
      type: "html/change";
      html: string;
    }
  | {
      type: "site/change";
      onSite: boolean;
    }
  | {
      type: "channel/toggle";
      channelId: number;
    }
  | {
      type: "media/start";
    }
  | {
      type: "media/add";
      files: PostMedia[];
    }
  | {
      type: "media/remove";
      file: PostMedia;
    }
  | {
      type: "media/error";
    }
  | {
      type: "submit/start";
      mode: SaveMode;
    }
  | {
      type: "submit/error";
    };
