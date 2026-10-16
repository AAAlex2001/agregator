import type { Post } from "@/entities/post";
import type { PostFormAction, PostFormState } from "./types";

/** Начальные поля формы: пустые для нового поста или из сохранённой публикации. */
export function createPostFormState(post?: Post): PostFormState {
  return {
    html: post?.html ?? "",
    media: post?.media ?? [],
    isMediaBusy: false,
    savingMode: null,
  };
}

/** Обновляет форму публикации по действию поля или результату запроса. */
export function postFormReducer(
  state: PostFormState,
  action: PostFormAction,
): PostFormState {
  switch (action.type) {
    case "html/change":
      return {
        ...state,
        html: action.html,
      };
    case "media/start":
      return {
        ...state,
        isMediaBusy: true,
      };
    case "media/add":
      return {
        ...state,
        media: [...state.media, ...action.files],
        isMediaBusy: false,
      };
    case "media/remove":
      return {
        ...state,
        media: state.media.filter((item) => item.id !== action.file.id),
        isMediaBusy: false,
      };
    case "media/error":
      return {
        ...state,
        isMediaBusy: false,
      };
    case "submit/start":
      return {
        ...state,
        savingMode: action.mode,
      };
    case "submit/error":
      return {
        ...state,
        savingMode: null,
      };
  }
}
