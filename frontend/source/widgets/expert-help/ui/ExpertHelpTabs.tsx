"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "@/source/features/session";
import { useLicenseHoldersDrawer } from "@/source/widgets/license-holders-drawer";
import { EXPERT_HELP_LINKS } from "../model/links";
import s from "./ExpertHelpTabs.module.scss";

export function ExpertHelpTabs() {
  const { role } = useSession();
  const pathname = usePathname();
  const licenseDrawer = useLicenseHoldersDrawer();

  if (role !== "EXPERT") return null;

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className={s.tabs}>
      {EXPERT_HELP_LINKS.map(({ href, label }) => (
        <Link key={href} href={href} className={`${s.tab} ${isActive(href) ? s.tabActive : ""}`}>
          <span className={s.inner}>{label}</span>
        </Link>
      ))}

      <button
        type="button"
        className={`${s.tab} ${licenseDrawer.isOpen ? s.tabActive : ""}`}
        onClick={licenseDrawer.open}
      >
        <span className={s.inner}>Держатели лицензии</span>
      </button>
    </div>
  );
}
