import { Suspense } from "react";
import type { Metadata } from "next";
import {
  fetchRtnList,
  fetchRtnTaxonomy,
  RTN_MAX_PAGE,
  RTN_PAGE_SIZE,
  RtnCatalogJsonLd,
  toCatalogQuery,
  type RawSearchParams,
} from "@/source/entities/rtn";
import { RedirectIfAuthed } from "@/source/entities/session";
import { LandingFooter, LandingHeader } from "@/source/widgets/landing";
import { RtnCatalogResults, RtnCatalogSkeleton, RtnCatalogWidget } from "@/source/widgets/rtn";

export const dynamic = "force-dynamic";

interface RtnListPageProps {
  searchParams: Promise<RawSearchParams>;
}

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

function readPage(params: RawSearchParams): number {
  return Math.min(RTN_MAX_PAGE, Math.max(1, Number(params.page) || 1));
}

export async function generateMetadata({ searchParams }: RtnListPageProps): Promise<Metadata> {
  const params = await searchParams;
  if (toCatalogQuery(params)) {
    return { ...baseMetadata, robots: { index: false, follow: true, googleBot: { index: false, follow: true } } };
  }

  const page = readPage(params);
  if (page === 1) return baseMetadata;
  return {
    ...baseMetadata,
    title: `${baseMetadata.title} — страница ${page}`,
    alternates: { canonical: `/rtn?page=${page}` },
  };
}

async function RtnCatalogData({ searchParams }: RtnListPageProps) {
  const params = await searchParams;
  const page = readPage(params);
  const filters = toCatalogQuery(params);
  const [initial, taxonomy] = await Promise.all([
    fetchRtnList({ filters, limit: RTN_PAGE_SIZE * page, offset: 0 }, { server: true }),
    fetchRtnTaxonomy({ server: true }),
  ]);
  const hasNextPage = !filters && initial.has_more && page < RTN_MAX_PAGE;

  return (
    <>
      <RtnCatalogJsonLd items={initial.items} />
      <RtnCatalogResults
        initial={initial}
        taxonomy={taxonomy}
        filters={filters}
        page={page}
        basePath=""
        nextPageHref={hasNextPage ? `/rtn?page=${page + 1}` : undefined}
      />
    </>
  );
}

export default function RtnListPage({ searchParams }: RtnListPageProps) {
  return (
    <>
      <RedirectIfAuthed to="/landing/rtn" />
      <LandingHeader />
      <main>
        <RtnCatalogWidget basePath="">
          <Suspense fallback={<RtnCatalogSkeleton />}>
            <RtnCatalogData searchParams={searchParams} />
          </Suspense>
        </RtnCatalogWidget>
      </main>
      <LandingFooter variant="light" />
    </>
  );
}
