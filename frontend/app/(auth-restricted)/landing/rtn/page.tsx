import { Suspense } from "react";
import type { Metadata } from "next";
import { fetchRtnList, fetchRtnTaxonomy, RTN_PAGE_SIZE, toCatalogQuery, type RawSearchParams } from "@/source/entities/rtn";
import { RtnCatalogResults, RtnCatalogSkeleton, RtnCatalogWidget } from "@/source/widgets/rtn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ростехнадзор отвечает",
  robots: { index: false, follow: false },
};

interface AuthedRtnListPageProps {
  searchParams: Promise<RawSearchParams>;
}

async function AuthedRtnCatalogData({ searchParams }: AuthedRtnListPageProps) {
  const filters = toCatalogQuery(await searchParams);
  const [initial, taxonomy] = await Promise.all([
    fetchRtnList({ filters, limit: RTN_PAGE_SIZE, offset: 0 }, { server: true }),
    fetchRtnTaxonomy({ server: true }),
  ]);
  return <RtnCatalogResults initial={initial} taxonomy={taxonomy} filters={filters} page={1} basePath="/landing" />;
}

export default function AuthedRtnListPage({ searchParams }: AuthedRtnListPageProps) {
  return (
    <RtnCatalogWidget basePath="/landing">
      <Suspense fallback={<RtnCatalogSkeleton />}>
        <AuthedRtnCatalogData searchParams={searchParams} />
      </Suspense>
    </RtnCatalogWidget>
  );
}
