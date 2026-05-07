"use client";

/**
 * Универсальное хранение черновиков в localStorage.
 * Создаёт набор операций с заданным префиксом ключа.
 *
 * Использование:
 *   const storage = createDraftStorage<MyDraft>("respond-draft");
 *   storage.save(123, draft);
 *   storage.load(123);
 *   storage.remove(123);
 *   storage.list();
 */
export interface DraftStorage<T> {
  save: (id: number, value: T) => void;
  load: (id: number) => T | null;
  remove: (id: number) => void;
  list: () => T[];
}

export function createDraftStorage<T>(prefix: string): DraftStorage<T> {
  const key = (id: number) => `${prefix}:${id}`;

  return {
    save(id, value) {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.setItem(key(id), JSON.stringify(value));
      } catch {
        /* ignore */
      }
    },
    load(id) {
      if (typeof window === "undefined") return null;
      try {
        const raw = window.localStorage.getItem(key(id));
        return raw ? (JSON.parse(raw) as T) : null;
      } catch {
        return null;
      }
    },
    remove(id) {
      if (typeof window === "undefined") return;
      try {
        window.localStorage.removeItem(key(id));
      } catch {
        /* ignore */
      }
    },
    list() {
      if (typeof window === "undefined") return [];
      const out: T[] = [];
      for (let i = 0; i < window.localStorage.length; i++) {
        const k = window.localStorage.key(i);
        if (!k?.startsWith(`${prefix}:`)) continue;
        const raw = window.localStorage.getItem(k);
        if (!raw) continue;
        try {
          out.push(JSON.parse(raw) as T);
        } catch {
          /* skip */
        }
      }
      return out;
    },
  };
}
