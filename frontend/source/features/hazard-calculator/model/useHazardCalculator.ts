"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import {
  createHazardReport,
  fetchHazardCatalog,
  type HazardCatalog,
  type HazardProfile,
  type HazardSelections,
} from "@/source/entities/hazard";

const HEADER_DEFAULTS: Record<string, string> = {
  author: "",
  intro_line1: "для анализа риска аварий Шахта+Рудник (АРА Шахта+Рудник)",
  intro_line2: "",
  intro_line3: "документации по ведению горных работ при условии соблюдения требований ФНП",
  justification: "",
  certificate:
    "Сертификат соответствия от 05.03.2024 г. № РОСС RU.32001.04ИБФ1.ОСП28.48630. Расчёт анализа риска аварий " +
    "Шахта+Рудник проводится на основании факторов, влияющих на опасность аварий и индексов опасности аварий (далее ИОА)",
  manufacturer: "Изготовитель ООО «СКК» ИНН 4217140314",
};

function selectionsFor(catalog: HazardCatalog, previous: HazardSelections): HazardSelections {
  const next: HazardSelections = {};
  catalog.groups.forEach((group) =>
    group.factors.forEach((factor) => {
      const prev = previous[factor.code];
      const valid = factor.options.some((option) => option.value === prev);
      next[factor.code] = valid ? prev : factor.default_value;
    }),
  );
  return next;
}

export function useHazardCalculator(onSaved?: () => void) {
  const { showError, showSuccess } = useNotifications();
  const [profile, setProfile] = useState<HazardProfile>("rudnik");
  const [catalog, setCatalog] = useState<HazardCatalog | null>(null);
  const [selections, setSelections] = useState<HazardSelections>({});
  const [excludedGroups, setExcludedGroups] = useState<string[]>([]);
  const [reportName, setReportName] = useState("Оценка опасности аварий");
  const [header, setHeader] = useState<Record<string, string>>(HEADER_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setExcludedGroups([]);
    fetchHazardCatalog(profile)
      .then((data) => {
        if (!active) return;
        setCatalog(data);
        setSelections(selectionsFor(data, {}));
      })
      .catch((error) => active && showError(error instanceof Error ? error.message : "Ошибка загрузки"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [profile, showError]);

  const select = (code: string, value: number | null) => setSelections((prev) => ({ ...prev, [code]: value }));

  const toggleGroupExcluded = (group: string) =>
    setExcludedGroups((prev) => (prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]));

  const setHeaderField = (key: string, value: string) => setHeader((prev) => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      await createHazardReport(profile, selections, reportName, header, excludedGroups);
      showSuccess("Отчёт сформирован и сохранён в «Историю отчётов»");
      onSaved?.();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сформировать отчёт");
    } finally {
      setSaving(false);
    }
  };

  return {
    profile,
    setProfile,
    catalog,
    selections,
    select,
    excludedGroups,
    toggleGroupExcluded,
    reportName,
    setReportName,
    header,
    setHeaderField,
    loading,
    saving,
    save,
  };
}
