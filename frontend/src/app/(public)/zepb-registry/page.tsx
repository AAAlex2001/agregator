import { ZepbRegistry } from "@/widgets/zepb-registry";
import { ZEPB_REGISTRY_METADATA } from "../../seo/zepb-registry";
import { PublicSiteShell } from "../../ui/shells/public-site-shell";

export const metadata = ZEPB_REGISTRY_METADATA;

/** Показывает ссылки на реестры заключений ЭПБ всем посетителям. */
export default function ZepbRegistryPage() {
  return (
    <PublicSiteShell>
      <ZepbRegistry homeHref="/" />
    </PublicSiteShell>
  );
}
