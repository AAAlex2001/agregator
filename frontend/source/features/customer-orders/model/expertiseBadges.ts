import type { Badge, BadgeVariant } from "@/source/entities/order";
import { cell, type ExpertiseType } from "@/source/entities/expertise";

const TYPE_VARIANT: Record<string, BadgeVariant> = {
  "ТУ": "orange",
  "КЛ": "blue",
  "ТП": "blue",
  "КЛ/ТП": "blue",
  "ЗС": "green",
  "Д": "brown",
  "ОБ": "gray",
};

function codeToVariant(code: string): BadgeVariant {
  const parts = code.split(" ", 2);
  if (parts.length < 2) return "orange";
  return TYPE_VARIANT[parts[1].trim()] ?? "orange";
}

export function flattenCodes(selections: Record<string, string[]>): string[] {
  const codes = Object.entries(selections).flatMap(([type, opos]) =>
    opos.flatMap((opo) => cell(opo, type as ExpertiseType)),
  );
  return [...new Set(codes)];
}

export function buildPreviewBadges(selections: Record<string, string[]>): Badge[] {
  return flattenCodes(selections).map((code) => ({ text: code, variant: codeToVariant(code) }));
}

export function parseBadges(badges: { text: string }[]): Record<string, string[]> {
  const result: Record<string, string[]> = {};
  for (const badge of badges) {
    const [opoWithPrefix, type] = badge.text.trim().split(" ");
    if (!opoWithPrefix?.startsWith("Э") || !type) continue;

    const opo = opoWithPrefix.slice(1);
    if (cell(opo, type as ExpertiseType).length === 0) continue;

    const opos = result[type] ?? [];
    if (!opos.includes(opo)) result[type] = [...opos, opo];
  }
  return result;
}
