import { redirect } from "next/navigation";
import { DefectoscopistCertification } from "@/widgets/defectoscopist-certification";
import { readSessionRole } from "../../../../../session/read-session-role";

/** Показывает страницу учебного центра исполнителю и держателю документов в кабинете. */
export default async function PrivateDefectoscopistCertificationPage() {
  const role = await readSessionRole();

  if (role && role !== "EXPERT" && role !== "LICENSE_HOLDER") {
    redirect("/settings");
  }

  return <DefectoscopistCertification homeHref="/landing" />;
}
