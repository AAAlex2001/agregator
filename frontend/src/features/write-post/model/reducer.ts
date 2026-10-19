import type { Post } from "@/entities/post";
import { DEFAULT_TELEGRAM_OPTIONS } from "../config/telegram-options";
import type { PostFormAction, PostFormState, PostTarget } from "./types";

/** Пост, который правят, куда пишется новый и на какой свой пост он отвечает. */
interface PostFormSource {
  post?: Post;
  target: PostTarget;
  replyTo: Post | null;
}

/** Каналы, где пост уже есть или ждёт отправки. */
function postChannelIds(post: Post): number[] {
  return post.deliveries
    .filter((delivery) => delivery.status !== "deleted")
    .map((delivery) => delivery.channel.id);
}

/** Начальные поля формы: пустые для нового поста или из сохранённой публикации. */
export function createPostFormState({ post, target, replyTo }: PostFormSource): PostFormState {
  return {
    html: post?.html ?? "",
    media: post?.media ?? [],
    onSite: post ? post.on_site : target === "site",
    channelIds: post ? postChannelIds(post) : [],
    telegram: post?.telegram ?? DEFAULT_TELEGRAM_OPTIONS,
    scheduledAt: post?.scheduled_at ?? "",
    replyTo,
    isMediaBusy: false,
    savingMode: null,
  };
}

/** Добавляет канал в выбор или убирает его оттуда. */
function toggleChannel(channelIds: number[], channelId: number): number[] {
  if (channelIds.includes(channelId)) {
    return channelIds.filter((id) => id !== channelId);
  }

  return [...channelIds, channelId];
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
    case "site/change":
      return {
        ...state,
        onSite: action.onSite,
      };
    case "channel/toggle":
      return {
        ...state,
        channelIds: toggleChannel(state.channelIds, action.channelId),
      };
    case "telegram/change":
      return {
        ...state,
        telegram: action.telegram,
      };
    case "schedule/change":
      return {
        ...state,
        scheduledAt: action.scheduledAt,
      };
    case "reply/clear":
      return {
        ...state,
        replyTo: null,
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
