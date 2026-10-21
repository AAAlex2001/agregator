"use client";

import type { BlitzCatalog } from "@/entities/blitz-order";
import { BLITZ_CATEGORIES } from "@/entities/blitz-order";
import { Button } from "@/shared/ui/button";
import { PlusIcon } from "@/shared/ui/icons";
import { Select } from "@/shared/ui/select";
import type { AttestationDraft } from "../../model/types";
import styles from "./style.module.scss";

/** Справочник, выбранная аттестация и её добавление. */
interface AttestationPickerProps {
  catalog: BlitzCatalog;
  draft: AttestationDraft;
  isReady: boolean;
  onChange: (draft: AttestationDraft) => void;
  onAdd: () => void;
}

/** Вариант списка: «Э12 — название». */
function toOption(item: { code: string; title: string }) {
  return { value: item.code, label: `${item.code} — ${item.title}` };
}

/** Область аттестации, объект по ней и категория — затем «Добавить». */
export function AttestationPicker({
  catalog,
  draft,
  isReady,
  onChange,
  onAdd,
}: AttestationPickerProps) {
  const area = catalog.areas.find((item) => item.code === draft.areaCode);
  const objects = catalog.objects.filter((item) => area?.objects.includes(item.code));

  return (
    <div className={styles.picker}>
      <Select
        ariaLabel="Область аттестации"
        placeholder="Область"
        options={catalog.areas.map(toOption)}
        value={draft.areaCode}
        onChange={(areaCode) => onChange({ ...draft, areaCode, objectCode: "" })}
      />
      <Select
        ariaLabel="Объект экспертизы"
        placeholder={area ? "Объект" : "Сначала область"}
        options={objects.map(toOption)}
        value={draft.objectCode}
        onChange={(objectCode) => onChange({ ...draft, objectCode })}
      />
      <Select
        ariaLabel="Категория"
        placeholder="Категория"
        options={BLITZ_CATEGORIES}
        value={draft.category}
        onChange={(category) => onChange({ ...draft, category })}
      />
      <Button
        variant="outline"
        size="field"
        disabled={!isReady}
        onClick={onAdd}
      >
        <PlusIcon />
        Добавить
      </Button>
    </div>
  );
}
