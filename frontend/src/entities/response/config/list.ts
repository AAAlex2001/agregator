import type { ResponseCounters } from "../model/types";

/** Количество откликов в одной странице списка. */
export const RESPONSES_PAGE_SIZE = 50;

/** Счётчики вкладок до первого ответа сервера. */
export const EMPTY_RESPONSE_COUNTERS: ResponseCounters = {
  all: 0,
  review: 0,
  in_progress: 0,
  rejected: 0,
  accepted: 0,
  withdrawn_by_expert: 0,
};
