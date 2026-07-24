import { Suspense } from "react";
import type { Metadata } from "next";
import {
  fetchRtnList,
  fetchRtnTaxonomy,
  parseRtnListFilters,
  toURLSearchParams,
} from "@/source/entities/rtn-clarification";
import { RtnCatalog } from "@/source/features/rtn-catalog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ростехнадзор отвечает",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

async function AuthedRtnCatalogContent({ searchParams }: Props) {
  const filters = parseRtnListFilters(toURLSearchParams(await searchParams));
  const [initial, taxonomy] = await Promise.all([
    fetchRtnList({ ...filters, limit: 12, offset: 0 }, { server: true }),
    fetchRtnTaxonomy({ server: true }),
  ]);
  return <RtnCatalog initial={initial} taxonomy={taxonomy} homeHref="/landing" />;
}

export default function AuthedRtnListPage({ searchParams }: Props) {
  return (
    <Suspense>
      <AuthedRtnCatalogContent searchParams={searchParams} />
    </Suspense>
  );
}
