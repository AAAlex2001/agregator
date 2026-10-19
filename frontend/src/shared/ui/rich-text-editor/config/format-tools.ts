import {
  BoldIcon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  UnderlineIcon,
} from "@/shared/ui/icons";
import type { FormatTool } from "../model/types";

/** Кнопки оформления в прежнем порядке. */
export const FORMAT_TOOLS: FormatTool[] = [
  {
    label: "Заголовок раздела",
    icon: Heading2Icon,
    isActive: (editor) => editor.isActive("heading", { level: 2 }),
    run: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    label: "Подзаголовок",
    icon: Heading3Icon,
    isActive: (editor) => editor.isActive("heading", { level: 3 }),
    run: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    label: "Жирный текст",
    icon: BoldIcon,
    isActive: (editor) => editor.isActive("bold"),
    run: (editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    label: "Курсив",
    icon: ItalicIcon,
    isActive: (editor) => editor.isActive("italic"),
    run: (editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    label: "Подчёркнутый текст",
    icon: UnderlineIcon,
    isActive: (editor) => editor.isActive("underline"),
    run: (editor) => editor.chain().focus().toggleUnderline().run(),
  },
  {
    label: "Маркированный список",
    icon: ListIcon,
    isActive: (editor) => editor.isActive("bulletList"),
    run: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    label: "Нумерованный список",
    icon: ListOrderedIcon,
    isActive: (editor) => editor.isActive("orderedList"),
    run: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    label: "Цитата",
    icon: QuoteIcon,
    isActive: (editor) => editor.isActive("blockquote"),
    run: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
];
