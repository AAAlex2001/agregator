"use client";

import { BreadcrumbPage } from "@/source/shared/ui/PageBreadcrumbs/PageBreadcrumbs";
import { usePathname } from "next/navigation";
import { CabinetSection } from "@/source/widgets/cabinet-section-tabs";
import { SidebarShell } from "@/source/widgets/sidebar";
import LandingHeaderAuthed from "@/source/widgets/landing/shared/ui/HeaderAuthed";

interface AppShellProps {
  children: React.ReactNode;
}

const SIDEBAR_ROUTES = [
  /^\/landing\/(?:blog|news|rtn|reviews)(?:\/.*)?$/,
  /^\/landing\/expert-contacts(?:\/.*)?$/,
  /^\/landing\/training(?:\/.*)?$/,
  /^\/customer\/orders(?:\/.*)?$/,
  /^\/customer\/reports(?:\/.*)?$/,
  /^\/expert\/orders(?:\/.*)?$/,
  /^\/expert\/reviews(?:\/.*)?$/,
  /^\/expert\/hazard(?:\/.*)?$/,
  /^\/expert\/lining(?:\/.*)?$/,
  /^\/expert\/room$/,
  /^\/expert-reviews(?:\/.*)?$/,
  /^\/experts\/[^/]+\/orders$/,
  /^\/labor(?:\/.*)?$/,
  /^\/responses$/,
  /^\/tech-expert$/,
  /^\/training(?:\/.*)?$/,
  /^\/zepb-registry$/,
  /^\/settings$/,
  /^\/chat(?:\/.*)?$/,
  /^\/archive(?:\/.*)?$/,
  /^\/support(?:\/.*)?$/,
  /^\/notifications(?:\/.*)?$/,
];

function shouldShowSidebar(pathname: string): boolean {
  return SIDEBAR_ROUTES.some((pattern) => pattern.test(pathname));
}

/** Меняет содержимое страницы, сохраняя шапку и боковое меню. */
export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isPosts = pathname === "/posts" || pathname.startsWith("/posts/");
  const content = isPosts ? (
    children
  ) : (
    <BreadcrumbPage>
      <CabinetSection>{children}</CabinetSection>
    </BreadcrumbPage>
  );

  if (isPosts || shouldShowSidebar(pathname)) {
    return <SidebarShell>{content}</SidebarShell>;
  }

  return (
    <>
      <LandingHeaderAuthed />
      {content}
    </>
  );
}
