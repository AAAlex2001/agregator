import { DefectoscopistCertification } from "@/widgets/defectoscopist-certification";
import { DEFECTOSCOPIST_CERTIFICATION_METADATA } from "../../../seo/defectoscopist-certification";
import { PublicSiteShell } from "../../../ui/shells/public-site-shell";

export const metadata = DEFECTOSCOPIST_CERTIFICATION_METADATA;

/** Показывает гостю страницу учебного центра, а вошедшего переводит в кабинет. */
export default function DefectoscopistCertificationPage() {
  return (
    <PublicSiteShell redirectTo="/landing/training/defectoscopist-certification">
      <DefectoscopistCertification homeHref="/" />
    </PublicSiteShell>
  );
}
