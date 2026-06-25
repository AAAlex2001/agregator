"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { uploadImage } from "./api";

export function Editor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false })],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const url = await uploadImage(file);
        editor.chain().focus().setImage({ src: url }).run();
      } catch {
        alert("Не удалось загрузить картинку");
      }
    };
    input.click();
  };

  return (
    <div className="editor">
      <div className="toolbar">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}>Ж</button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}>К</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>H3</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}>• Список</button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}>Цитата</button>
        <button type="button" onClick={addImage}>Картинка</button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
