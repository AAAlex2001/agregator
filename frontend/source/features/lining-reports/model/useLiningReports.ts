"use client";

import { useEffect, useState } from "react";
import { useNotifications } from "@/source/shared/ui/Notifications";
import { fetchLiningReports, type LiningReportItem } from "@/source/entities/lining";

export function useLiningReports() {
  const { showError } = useNotifications();
  const [reports, setReports] = useState<LiningReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchLiningReports()
      .then((items) => active && setReports(items))
      .catch((error) => active && showError(error instanceof Error ? error.message : "Ошибка загрузки"))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [showError]);

  return { reports, loading };
}
