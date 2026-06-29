"use client";

import { useSession } from "@/source/features/session";
import { useLicenseHoldersDrawer } from "@/source/widgets/license-holders-drawer";
import { useReviewsHub } from "@/source/widgets/reviews-hub";
import { getUsefulLinks, useUsefulLinks } from "@/source/widgets/useful-links";
import { useExpertHelpDrawer } from "../model/ExpertHelpContext";
import s from "./ExpertHelpPlates.module.scss";

export function ExpertHelpPlates() {
  const { role } = useSession();
  const expertHelp = useExpertHelpDrawer();
  const license = useLicenseHoldersDrawer();
  const reviews = useReviewsHub();
  const useful = useUsefulLinks();

  if (role !== "EXPERT" && role !== "CUSTOMER") return null;

  const hasUseful = getUsefulLinks(role).length > 0;

  return (
    <div className={s.plates}>
      {role === "EXPERT" && (
        <>
          <button type="button" className={`${s.plate} ${s.green}`} onClick={expertHelp.open}>
            <span className={s.label}>Помощь эксперту</span>
          </button>

          <button type="button" className={`${s.plate} ${s.orange}`} onClick={license.open}>
            <span className={s.label}>Держатели лицензии</span>
          </button>
        </>
      )}

      <button type="button" className={`${s.plate} ${s.blue}`} onClick={reviews.open}>
        <span className={s.label}>Все отзывы</span>
      </button>

      {hasUseful && (
        <button type="button" className={`${s.plate} ${s.purple}`} onClick={useful.open}>
          <span className={s.label}>Полезные ссылки</span>
        </button>
      )}
    </div>
  );
}
