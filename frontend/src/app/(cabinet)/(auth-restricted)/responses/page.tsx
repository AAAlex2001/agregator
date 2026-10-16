import { toResponseTab } from "@/entities/response";
import { ResponsesPageContent } from "../../../ui/pages/responses-page-content";

/** Вкладка откликов из ссылки ?tab=. */
interface ResponsesPageProps {
  searchParams: Promise<{ tab?: string | string[] }>;
}

/** Открывает отклики текущего аккаунта на вкладке из адреса. */
export default async function ResponsesPage({ searchParams }: ResponsesPageProps) {
  const params = await searchParams;
  const tab = typeof params.tab === "string" ? params.tab : undefined;

  return <ResponsesPageContent initialTab={toResponseTab(tab)} />;
}
