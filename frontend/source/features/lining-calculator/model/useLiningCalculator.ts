"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import {
  createLiningReport,
  fetchLiningCatalog,
  type ElementCategories,
  type ExpertScores,
  type LiningCatalog,
  type LiningInput,
  type LiningSelections,
} from "@/source/entities/lining";

const HEADER_DEFAULTS: Record<string, string> = {
  author: "",
  intro_line1: "",
  intro_line2: "",
  intro_line3: "",
  justification: "",
  manufacturer: "",
};

export function useLiningCalculator(onSaved?: () => void) {
  const { showError, showSuccess } = useNotifications();
  const [catalog, setCatalog] = useState<LiningCatalog | null>(null);
  const [selections, setSelections] = useState<LiningSelections>({});
  const [elementCategories, setElementCategories] = useState<ElementCategories>({});
  const [serviceLifeYears, setServiceLifeYears] = useState(5);
  const [expertScores, setExpertScores] = useState<ExpertScores>({});
  const [reportName, setReportName] = useState("Оценка крепи горной выработки");
  const [header, setHeader] = useState<Record<string, string>>(HEADER_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    fetchLiningCatalog("rudnik")
      .then((data) => {
        if (!active) return;
        setCatalog(data);
        const sel: LiningSelections = {};
        data.groups.forEach((group) => group.factors.forEach((factor) => {
          sel[factor.code] = factor.default_value;
        }));
        setSelections(sel);
        const cats: ElementCategories = {};
        data.elements.forEach((element) => {
          cats[String(element.id)] = 1;
        });
        setElementCategories(cats);
        const scores: ExpertScores = {};
        data.expert_criteria.forEach((criterion) => {
          scores[String(criterion.id)] = 1;
        });
        setExpertScores(scores);
      })
      .catch((error) => active && showError(error instanceof Error ? error.message : "Ошибка загрузки"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [showError]);

  const select = (code: string, value: number | null) => setSelections((prev) => ({ ...prev, [code]: value }));
  const setElementCategory = (id: number, category: number) =>
    setElementCategories((prev) => ({ ...prev, [String(id)]: category }));
  const setExpertScore = (id: number, score: number) =>
    setExpertScores((prev) => ({ ...prev, [String(id)]: score }));
  const setServiceLife = (years: number) => setServiceLifeYears(years);
  const setHeaderField = (key: string, value: string) => setHeader((prev) => ({ ...prev, [key]: value }));

  const buildInput = (): LiningInput => ({
    profile: "rudnik",
    selections,
    element_categories: elementCategories,
    service_life_years: serviceLifeYears,
    expert_scores: expertScores,
  });

  const save = async () => {
    setSaving(true);
    try {
      await createLiningReport(buildInput(), reportName, header);
      showSuccess("Отчёт сформирован и сохранён в «Историю отчётов»");
      onSaved?.();
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сформировать отчёт");
    } finally {
      setSaving(false);
    }
  };

  return {
    catalog,
    selections,
    select,
    elementCategories,
    setElementCategory,
    serviceLifeYears,
    setServiceLife,
    expertScores,
    setExpertScore,
    reportName,
    setReportName,
    header,
    setHeaderField,
    loading,
    saving,
    save,
  };
}
