"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import {
  createHazardReport,
  fetchHazardCatalog,
  resetHazardCatalog,
  saveHazardCatalog,
  type HazardCatalog,
  type HazardFactor,
  type HazardProfile,
  type HazardSelections,
} from "@/source/entities/hazard";

const HEADER_DEFAULTS: Record<string, string> = {
  author: "",
  intro_line1: "для анализа риска аварий Шахта+Рудник (АРА Шахта+Рудник)",
  intro_line2: "на руднике «Интернациональный» АК «АЛРОСА» (ПАО)",
  intro_line3: "документации по ведению горных работ при условии соблюдения требований ФНП",
  justification:
    "«Обоснование безопасности опасного производственного объекта подземного рудника «Интернациональный» " +
    "Мирнинско-Нюрбинского ГОК по использованию аппарата распыления полимочевины Graco Reactor 2 E-CP2 " +
    "в подземных горных выработках рудника «Интернациональный»",
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
  const [editing, setEditing] = useState<HazardFactor | null>(null);
  const [creating, setCreating] = useState(false);
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

  const applyCatalog = (next: HazardCatalog) => {
    setCatalog(next);
    setSelections((prev) => selectionsFor(next, prev));
  };

  const persist = async (groups: HazardCatalog["groups"]) => {
    try {
      const updated = await saveHazardCatalog(profile, groups.flatMap((group) => group.factors));
      applyCatalog(updated);
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сохранить факторы");
    }
  };

  const saveFactor = async (factor: HazardFactor) => {
    if (!catalog) return;
    const values = factor.options.map((option) => option.value).filter((v): v is number => v != null);
    const normalized: HazardFactor = {
      ...factor,
      max_score: values.length ? Math.max(...values) : 0,
      default_value: factor.options[0]?.value ?? null,
    };
    const groups = catalog.groups.map((group) => {
      if (group.group !== factor.group) return group;
      const exists = group.factors.some((f) => f.code === factor.code);
      return {
        ...group,
        factors: exists
          ? group.factors.map((f) => (f.code === factor.code ? normalized : f))
          : [...group.factors, normalized],
      };
    });
    setEditing(null);
    await persist(groups);
  };

  const deleteFactor = async (factor: HazardFactor) => {
    if (!catalog) return;
    const groups = catalog.groups.map((group) =>
      group.group === factor.group
        ? { ...group, factors: group.factors.filter((f) => f.code !== factor.code) }
        : group,
    );
    setEditing(null);
    await persist(groups);
  };

  const nextCodeForGroup = (group: string) => {
    const groupData = catalog?.groups.find((g) => g.group === group);
    const maxIdx = Math.max(0, ...(groupData?.factors ?? []).map((f) => Number(f.code.split(".")[1]) || 0));
    return `${group}.${maxIdx + 1}`;
  };

  const editFactor = (factor: HazardFactor) => {
    setCreating(false);
    setEditing(factor);
  };

  const addFactor = (group: string) => {
    if (!catalog) return;
    setCreating(true);
    setEditing({
      code: nextCodeForGroup(group),
      group,
      name: "Новый фактор",
      max_score: 0,
      default_value: 0,
      options: [
        { value: 0, label: "Вариант (0,00)" },
        { value: null, label: "Нет (без оценки)" },
      ],
    });
  };

  const resetCatalog = async () => {
    try {
      applyCatalog(await resetHazardCatalog(profile));
      showSuccess("Факторы сброшены к исходным");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сбросить факторы");
    }
  };

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
    editing,
    setEditing,
    creating,
    editFactor,
    nextCodeForGroup,
    saveFactor,
    deleteFactor,
    addFactor,
    resetCatalog,
    reportName,
    setReportName,
    header,
    setHeaderField,
    loading,
    saving,
    save,
  };
}
