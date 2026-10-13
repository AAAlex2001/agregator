"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs } from "@/source/shared/ui/Breadcrumbs";
import { getPageBreadcrumbs } from "@/source/shared/lib/navigation/pageBreadcrumbs";
import s from "./PageBreadcrumbs.module.scss";

export function PageBreadcrumbs() {
  const items = getPageBreadcrumbs(usePathname());
  return items ? <div className={s.container}><Breadcrumbs items={items} /></div> : null;
}

export function BreadcrumbPage({ children }: { children: React.ReactNode }) {
  const items = getPageBreadcrumbs(usePathname());
  if (!items) return children;
  return (
    <div className={s.page}>
      <div className={s.container}><Breadcrumbs items={items} /></div>
      {children}
    </div>
  );
}
