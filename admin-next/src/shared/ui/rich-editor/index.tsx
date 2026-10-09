"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { errorMessage } from "@/shared/lib/errors";
import { useToast } from "@/shared/ui/toaster";
import { Video } from "./lib/video-node";
import LinkModal from "./ui/link-modal";
import EditorToolbar from "./ui/toolbar";
import styles from "./style.module.scss";

type RichEditorProps = {
  value: string;
  onChange: (html: string) => void;
  ariaLabel: string;
  onUploadImage?: (file: File) => Promise<string>;
  onUploadVideo?: (file: File) => Promise<string>;
};

/**
 * Редактор HTML-текста на tiptap. value — начальное содержимое, дальше редактор ведёт его сам
 * и отдаёт HTML в onChange. Загрузку файлов делает тот, кто его использует.
 */
const RichEditor = ({ value, onChange, ariaLabel, onUploadImage, onUploadVideo }: RichEditorProps) => {
  const toast = useToast();
  const [linkOpen, setLinkOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const editor = useEditor({
    extensions: [StarterKit, Image, Link.configure({ openOnClick: false }), Video],
    content: value,
    immediatelyRender: false,
    editorProps: { attributes: { class: styles.content, "aria-label": ariaLabel } },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return <div className={styles.editor} />;

  const upload = async (file: File, send: (file: File) => Promise<string>, insert: (url: string) => void) => {
    setUploading(true);

    try {
      insert(await send(file));
    } catch (failure) {
      toast(errorMessage(failure, "Не удалось загрузить файл"), "error");
    } finally {
      setUploading(false);
    }
  };

  const applyLink = (url: string) => {
    const chain = editor.chain().focus().extendMarkRange("link");

    if (url) chain.setLink({ href: url }).run();
    else chain.unsetLink().run();

    setLinkOpen(false);
  };

  return (
    <div className={styles.editor}>
      <EditorToolbar
        editor={editor}
        uploading={uploading}
        onLink={() => setLinkOpen(true)}
        onImage={onUploadImage && ((file) => upload(file, onUploadImage, (src) => editor.chain().focus().setImage({ src }).run()))}
        onVideo={
          onUploadVideo &&
          ((file) => upload(file, onUploadVideo, (src) => editor.chain().focus().insertContent({ type: "video", attrs: { src } }).run()))
        }
      />

      <EditorContent editor={editor} />

      {linkOpen && (
        <LinkModal open initialUrl={editor.getAttributes("link").href ?? ""} onSubmit={applyLink} onClose={() => setLinkOpen(false)} />
      )}
    </div>
  );
};

export default RichEditor;
