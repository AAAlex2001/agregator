"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import {
  calculateLining,
  createLiningReport,
  fetchLiningCatalog,
  type ElementCategories,
  type ExpertScores,
  type LiningCatalog,
  type LiningInput,
  type LiningResult,
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

export function useLiningCalculator() {
  const { showError, showSuccess } = useNotifications();
  const [catalog, setCatalog] = useState<LiningCatalog | null>(null);
  const [selections, setSelections] = useState<LiningSelections>({});
  const [elementCategories, setElementCategories] = useState<ElementCategories>({});
  const [serviceLifeYears, setServiceLifeYears] = useState(5);
  const [expertScores, setExpertScores] = useState<ExpertScores>({});
  const [result, setResult] = useState<LiningResult | null>(null);
  const [reportName, setReportName] = useState("Оценка крепи горной выработки");
  const [header, setHeader] = useState<Record<string, string>>(HEADER_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [generating, setGenerating] = useState(false);

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

  const select = (code: string, value: number | null) => {
    setSelections((prev) => ({ ...prev, [code]: value }));
    setResult(null);
  };

  const setElementCategory = (id: number, category: number) => {
    setElementCategories((prev) => ({ ...prev, [String(id)]: category }));
    setResult(null);
  };

  const setExpertScore = (id: number, score: number) => {
    setExpertScores((prev) => ({ ...prev, [String(id)]: score }));
    setResult(null);
  };

  const setServiceLife = (years: number) => {
    setServiceLifeYears(years);
    setResult(null);
  };

  const setHeaderField = (key: string, value: string) => setHeader((prev) => ({ ...prev, [key]: value }));

  const buildInput = (): LiningInput => ({
    profile: "rudnik",
    selections,
    element_categories: elementCategories,
    service_life_years: serviceLifeYears,
    expert_scores: expertScores,
  });

  const calculate = async () => {
    setCalculating(true);
    try {
      setResult(await calculateLining(buildInput()));
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось рассчитать");
    } finally {
      setCalculating(false);
    }
  };

  const generate = async () => {
    setGenerating(true);
    try {
      const blob = await createLiningReport(buildInput(), reportName, header);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${reportName || "otchet"}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showSuccess("Отчёт сформирован и сохранён в историю");
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось сформировать отчёт");
    } finally {
      setGenerating(false);
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
    result,
    reportName,
    setReportName,
    header,
    setHeaderField,
    loading,
    calculating,
    generating,
    calculate,
    generate,
  };
}
