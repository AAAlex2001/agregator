import { Suspense } from "react";
import type { Metadata } from "next";
import { LandingHeader, LandingFooter } from "@/source/widgets/landing";
import {
  fetchRtnList,
  fetchRtnTaxonomy,
  parseRtnListFilters,
  toURLSearchParams,
} from "@/source/entities/rtn-clarification";
import { RtnCatalog } from "@/source/features/rtn-catalog";
import { RedirectIfAuthed } from "@/source/features/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
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

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

async function RtnCatalogContent({ searchParams }: Props) {
  const filters = parseRtnListFilters(toURLSearchParams(await searchParams));
  const [initial, taxonomy] = await Promise.all([
    fetchRtnList({ ...filters, limit: 12, offset: 0 }, { server: true }),
    fetchRtnTaxonomy({ server: true }),
  ]);
  return <RtnCatalog initial={initial} taxonomy={taxonomy} homeHref="/" />;
}

export default function RtnListPage({ searchParams }: Props) {
  return (
    <>
      <RedirectIfAuthed to="/landing/rtn" />
      <LandingHeader />
      <main>
        <Suspense>
          <RtnCatalogContent searchParams={searchParams} />
        </Suspense>
      </main>
      <LandingFooter variant="light" />
    </>
  );
}
