"use client";

import { useSession } from "@/source/features/session";
import { useLicenseHoldersDrawer } from "@/source/widgets/license-holders-drawer";
import { useExpertHelpDrawer } from "../model/ExpertHelpContext";
import s from "./ExpertHelpPlates.module.scss";

export function ExpertHelpPlates() {
  const { role } = useSession();
  const expertHelp = useExpertHelpDrawer();
  const license = useLicenseHoldersDrawer();

  if (role !== "EXPERT") return null;

  return (
    <div className={s.plates}>
      <button
        type="button"
        className={`${s.plate} ${s.green}`}
        onClick={expertHelp.open}
      >
        <span className={s.label}>Помощь эксперту</span>
      </button>

      <button
        type="button"
        className={`${s.plate} ${s.orange}`}
        onClick={license.open}
      >
        <span className={s.label}>Держатели лицензии</span>
      </button>
    </div>
  );
}
