"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CabinetSection } from "@/widgets/cabinet-section";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs";
import { isPostsPage } from "../../../config/cabinet-routes";
import { getPageBreadcrumbs } from "../../../config/page-breadcrumbs";
import styles from "./style.module.scss";

/** Содержимое страницы кабинета. */
interface CabinetPageProps {
  children: ReactNode;
}

/** Добавляет хлебные крошки и вкладки раздела; публикации раскладывают себя сами. */
export function CabinetPage({ children }: CabinetPageProps) {
  const pathname = usePathname();

  if (isPostsPage(pathname)) {
    return children;
  }

  const breadcrumbs = getPageBreadcrumbs(pathname);
  const section = <CabinetSection>{children}</CabinetSection>;

  if (!breadcrumbs) {
    return section;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <Breadcrumbs items={breadcrumbs} />
      </div>
      {section}
    </div>
  );
}
