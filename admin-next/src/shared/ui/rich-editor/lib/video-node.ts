import { Node } from "@tiptap/core";

/** Блок с видео: хранит только src, в HTML выходит как <video controls>. */
export const Video = Node.create({
  name: "video",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return { src: { default: null } };
  },

  parseHTML() {
    return [{ tag: "video" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["video", { ...HTMLAttributes, controls: "true" }];
  },
});
