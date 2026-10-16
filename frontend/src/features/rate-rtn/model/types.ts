import type { RtnReactions } from "@/entities/rtn";

/** Разъяснение и его серверные счётчики для оценки полезности. */
export interface RateRtnProps {
  clarificationId: number;
  initial: RtnReactions;
}
