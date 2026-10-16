import { Suspense } from "react";
import type { Metadata } from "next";
import { RtnCatalog, RtnCatalogSkeleton } from "@/widgets/rtn";
import type { RtnCatalogPageProps } from "../../content/rtn-catalog-query";
import { createRtnCatalogMetadata } from "../../seo/rtn-catalog";
import { RtnCatalogPageContent } from "../../ui/pages/rtn-catalog-page-content";
import { PublicSiteShell } from "../../ui/shells/public-site-shell";

export const dynamic = "force-dynamic";

/** Сохраняет canonical пагинации и запрет индексации поисковой выдачи. */
export async function generateMetadata({
  searchParams,
}: RtnCatalogPageProps): Promise<Metadata> {
  return createRtnCatalogMetadata(await searchParams);
}

/** Открывает публичный каталог с серверной выдачей и структурированными данными. */
export default function RtnPage({ searchParams }: RtnCatalogPageProps) {
  return (
    <PublicSiteShell redirectTo="/landing/rtn">
      <main>
        <RtnCatalog basePath="">
          <Suspense fallback={<RtnCatalogSkeleton />}>
            <RtnCatalogPageContent
              searchParams={searchParams}
              basePath=""
            />
          </Suspense>
        </RtnCatalog>
      </main>
    </PublicSiteShell>
  );
}
