"use client";

import { useUnreadCount } from "../model/UnreadCountProvider";
import s from "./UnreadCountBadge.module.scss";

/** Число непрочитанных уведомлений в оранжевой плашке. */
export function UnreadCountBadge() {
  const { count } = useUnreadCount();
  return <span className={s.badge}>{count}</span>;
}
