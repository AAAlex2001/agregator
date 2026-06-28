"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import {
  calculateHazard,
  createHazardReport,
  fetchHazardCatalog,
  type HazardCatalog,
  type HazardProfile,
  type HazardResult,
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

export function useHazardCalculator() {
  const { showError, showSuccess } = useNotifications();
  const [profile, setProfile] = useState<HazardProfile>("rudnik");
  const [catalog, setCatalog] = useState<HazardCatalog | null>(null);
  const [selections, setSelections] = useState<HazardSelections>({});
  const [result, setResult] = useState<HazardResult | null>(null);
  const [reportName, setReportName] = useState("Оценка опасности аварий");
  const [header, setHeader] = useState<Record<string, string>>(HEADER_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setResult(null);
    fetchHazardCatalog(profile)
      .then((data) => {
        if (!active) return;
        const defaults: HazardSelections = {};
        data.groups.forEach((group) =>
          group.factors.forEach((factor) => {
            defaults[factor.code] = factor.default_value;
          }),
        );
        setCatalog(data);
        setSelections(defaults);
      })
      .catch((error) => active && showError(error instanceof Error ? error.message : "Ошибка загрузки"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [profile, showError]);

  const select = (code: string, value: number | null) => {
    setSelections((prev) => ({ ...prev, [code]: value }));
    setResult(null);
  };

  const calculate = async () => {
    setCalculating(true);
    try {
      setResult(await calculateHazard(profile, selections));
    } catch (error) {
      showError(error instanceof Error ? error.message : "Не удалось рассчитать");
    } finally {
      setCalculating(false);
    }
  };

  const setHeaderField = (key: string, value: string) => setHeader((prev) => ({ ...prev, [key]: value }));

  const generate = async () => {
    setGenerating(true);
    try {
      const blob = await createHazardReport(profile, selections, reportName, header);
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
    profile,
    setProfile,
    catalog,
    selections,
    select,
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
