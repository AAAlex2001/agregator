"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { fetchHazardReports, type HazardReportItem } from "@/source/entities/hazard";

export function useHazardReports() {
  const { showError } = useNotifications();
  const [reports, setReports] = useState<HazardReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchHazardReports()
      .then((items) => active && setReports(items))
      .catch((error) => active && showError(error instanceof Error ? error.message : "Ошибка загрузки"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [showError]);

  return { reports, loading };
}
