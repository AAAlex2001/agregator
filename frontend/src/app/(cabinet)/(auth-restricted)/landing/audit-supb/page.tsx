import { loadServiceNews } from "../../../../content/load-service-news";
import { AuditPageContent } from "../../../../ui/pages/audit-page-content";

export const dynamic = "force-dynamic";

/** Загружает страницу кабинета для аудита СУПБ. */
export default async function PrivateAuditPage() {
  const news = await loadServiceNews("AUDIT_SUPB");

  return <AuditPageContent news={news} />;
}
