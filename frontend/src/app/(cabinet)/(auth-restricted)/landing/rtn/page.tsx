import { Suspense } from "react";
import { RtnCatalog, RtnCatalogSkeleton } from "@/widgets/rtn";
import type { RtnCatalogPageProps } from "../../../../content/rtn-catalog-query";
import { createPrivateMetadata } from "../../../../seo/private-page";
import { RtnCatalogPageContent } from "../../../../ui/pages/rtn-catalog-page-content";

export const dynamic = "force-dynamic";
export const metadata = createPrivateMetadata("Ростехнадзор отвечает");

/** Открывает кабинетный каталог с клиентской догрузкой и закрытой индексацией. */
export default function PrivateRtnPage({ searchParams }: RtnCatalogPageProps) {
  return (
    <RtnCatalog basePath="/landing">
      <Suspense fallback={<RtnCatalogSkeleton />}>
        <RtnCatalogPageContent
          searchParams={searchParams}
          basePath="/landing"
        />
      </Suspense>
    </RtnCatalog>
  );
}
