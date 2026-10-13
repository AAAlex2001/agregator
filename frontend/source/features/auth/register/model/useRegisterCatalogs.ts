"use client";

import { useEffect, useState } from "react";
import { emptyAuditCatalogs, fetchAuditCatalogs } from "@/source/entities/directions/audit";
import { emptyDesignCatalogs, fetchDesignCatalogs } from "@/source/entities/directions/design";
import { emptyEcologyCatalogs, fetchEcologyCatalogs } from "@/source/entities/directions/ecology";
import { emptyResearchCatalogs, fetchResearchCatalogs } from "@/source/entities/directions/research";
import { emptySurveyCatalogs, fetchSurveyCatalogs } from "@/source/entities/directions/survey";
import { emptyTechDiagCatalogs, fetchTechDiagCatalogs } from "@/source/entities/directions/tech-diag";

/** Справочники для анкет исполнителя. Недоступный справочник остаётся пустым, форма при этом работает. */
export function useRegisterCatalogs() {
  const [catalogs, setCatalogs] = useState({
    audit: emptyAuditCatalogs,
    techDiag: emptyTechDiagCatalogs,
    design: emptyDesignCatalogs,
    ecology: emptyEcologyCatalogs,
    research: emptyResearchCatalogs,
    survey: emptySurveyCatalogs,
  });

  useEffect(() => {
    Promise.all([
      fetchAuditCatalogs().catch(() => emptyAuditCatalogs),
      fetchTechDiagCatalogs().catch(() => emptyTechDiagCatalogs),
      fetchDesignCatalogs().catch(() => emptyDesignCatalogs),
      fetchEcologyCatalogs().catch(() => emptyEcologyCatalogs),
      fetchResearchCatalogs().catch(() => emptyResearchCatalogs),
      fetchSurveyCatalogs().catch(() => emptySurveyCatalogs),
    ]).then(([audit, techDiag, design, ecology, research, survey]) =>
      setCatalogs({ audit, techDiag, design, ecology, research, survey }),
    );
  }, []);

  return catalogs;
}
