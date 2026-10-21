import { CommissionPage } from "@/widgets/commission";
import { COMMISSION_METADATA } from "../../seo/commission";
import { PublicSiteShell } from "../../ui/shells/public-site-shell";

export const metadata = COMMISSION_METADATA;

/** Конкурсный отбор экспертов: оффер и заявка кандидата. */
export default function KonkursnayaKomissiyaPage() {
  return (
    <PublicSiteShell>
      <CommissionPage />
    </PublicSiteShell>
  );
}
