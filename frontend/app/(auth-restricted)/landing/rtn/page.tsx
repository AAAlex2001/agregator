import { Suspense } from "react";
import type { Metadata } from "next";
import {
  fetchRtnList,
  fetchRtnTaxonomy,
  parseRtnListFilters,
  toURLSearchParams,
} from "@/source/entities/rtn-clarification";
import { RtnCatalogWidget, RtnCatalogResults, RtnCatalogSkeleton } from "@/source/widgets/rtn-catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ростехнадзор отвечает",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

async function AuthedRtnCatalogData({ searchParams }: Props) {
  const filters = parseRtnListFilters(toURLSearchParams(await searchParams));
  const [initial, taxonomy] = await Promise.all([
    fetchRtnList({ ...filters, limit: 12, offset: 0 }, { server: true }),
    fetchRtnTaxonomy({ server: true }),
  ]);
  return <RtnCatalogResults initial={initial} taxonomy={taxonomy} />;
}

export default function AuthedRtnListPage({ searchParams }: Props) {
  return (
    <RtnCatalogWidget homeHref="/landing">
      <Suspense fallback={<RtnCatalogSkeleton />}>
        <AuthedRtnCatalogData searchParams={searchParams} />
      </Suspense>
    </RtnCatalogWidget>
  );
}
