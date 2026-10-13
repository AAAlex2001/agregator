"use client";

import { useEffect, useState } from "react";
import type { OrderWorkType } from "@/source/entities/order";
import { fetchAuditCatalogs } from "../audit";
import { fetchDesignCatalogs } from "../design";
import { fetchEcologyCatalogs } from "../ecology";
import { fetchSurveyCatalogs } from "../survey";
import { emptyOrderCatalogs, type OrderCatalogs } from "./catalogs";

/** Справочники для анкеты заказа: грузится только тот, что нужен выбранному направлению. */
export function useOrderCatalogs(workType: OrderWorkType): OrderCatalogs {
  const [catalogs, setCatalogs] = useState(emptyOrderCatalogs);

  useEffect(() => {
    if (workType === "AUDIT_SUPB") fetchAuditCatalogs().then((audit) => setCatalogs((c) => ({ ...c, audit }))).catch(() => undefined);
    if (workType === "DESIGN") fetchDesignCatalogs().then((design) => setCatalogs((c) => ({ ...c, design }))).catch(() => undefined);
    if (workType === "ECOLOGY") fetchEcologyCatalogs().then((ecology) => setCatalogs((c) => ({ ...c, ecology }))).catch(() => undefined);
    if (workType === "SURVEY") fetchSurveyCatalogs().then((survey) => setCatalogs((c) => ({ ...c, survey }))).catch(() => undefined);
  }, [workType]);

  return catalogs;
}
