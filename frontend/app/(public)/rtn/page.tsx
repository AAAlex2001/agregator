import { Suspense } from "react";
import type { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import {
  fetchRtnList,
  fetchRtnTaxonomy,
  parseRtnListFilters,
  toURLSearchParams,
} from "@/source/entities/rtn-clarification";
import {
  RtnCatalogWidget,
  RtnCatalogResults,
  RtnCatalogSkeleton,
  RtnCatalogJsonLd,
} from "@/source/widgets/rtn-catalog";
import { RedirectIfAuthed } from "@/source/features/session";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

const baseMetadata: Metadata = {
  title: "Ростехнадзор отвечает: база официальных ответов — Ресурс-Плюс",
  description:
    "Актуальные ответы на сложные вопросы промышленной, энергетической и строительной безопасности. Систематизированная база официальных ответов Ростехнадзора.",
  keywords: [
    "ростехнадзор отвечает",
    "разъяснения ростехнадзора",
    "промышленная безопасность вопросы ответы",
    "официальные письма ростехнадзора",
  ],
  alternates: { canonical: "/rtn" },
  openGraph: {
    title: "Ростехнадзор отвечает: база официальных ответов",
    description: "Систематизированная база официальных ответов Ростехнадзора на вопросы промышленной безопасности.",
    type: "website",
    url: "/rtn",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Ресурс-Плюс" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ростехнадзор отвечает: база официальных ответов",
    description: "Систематизированная база официальных ответов Ростехнадзора.",
    images: ["/og-default.png"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const PAGE_SIZE = 12;
const MAX_PAGE = 10;

type RawParams = Record<string, string | string[] | undefined>;

function readPage(params: RawParams): number {
  return Math.min(MAX_PAGE, Math.max(1, Number(params.page) || 1));
}

function isFiltered(params: RawParams): boolean {
  return Object.entries(params).some(([key, value]) =>
    key === "page" ? false : Array.isArray(value) ? value.length > 0 : Boolean(value),
  );
}

function pageHref(params: RawParams, page: number): string {
  const search = toURLSearchParams({ ...params, page: undefined });
  search.set("page", String(page));
  return `/rtn?${search.toString()}`;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  if (isFiltered(params)) {
    return {
      ...baseMetadata,
      robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
    };
  }

  const page = readPage(params);
  if (page === 1) return baseMetadata;

  return {
    ...baseMetadata,
    title: `${baseMetadata.title} — страница ${page}`,
    alternates: { canonical: `/rtn?page=${page}` },
  };
}

async function RtnCatalogData({ searchParams }: Props) {
  const params = await searchParams;
  const page = readPage(params);
  const filters = parseRtnListFilters(toURLSearchParams(params));
  const [initial, taxonomy] = await Promise.all([
    fetchRtnList({ ...filters, limit: PAGE_SIZE * page, offset: 0 }, { server: true }),
    fetchRtnTaxonomy({ server: true }),
  ]);

  return (
    <>
      <RtnCatalogJsonLd items={initial.items} />
      <RtnCatalogResults
        key={page}
        initial={initial}
        taxonomy={taxonomy}
        nextPageHref={
          initial.has_more && page < MAX_PAGE ? pageHref(params, page + 1) : undefined
        }
      />
    </>
  );
}

export default function RtnListPage({ searchParams }: Props) {
  return (
    <>
      <RedirectIfAuthed to="/landing/rtn" />
      <LandingHeader />
      <main>
        <RtnCatalogWidget homeHref="/">
          <Suspense fallback={<RtnCatalogSkeleton />}>
            <RtnCatalogData searchParams={searchParams} />
          </Suspense>
        </RtnCatalogWidget>
      </main>
      <LandingFooter variant="light" />
    </>
  );
}
