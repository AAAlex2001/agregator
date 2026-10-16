import { redirect } from "next/navigation";
import { ZepbRegistry } from "@/widgets/zepb-registry";
import { readSessionRole } from "../../../../session/read-session-role";

/** Показывает реестры заключений ЭПБ исполнителю и держателю документов в кабинете. */
export default async function PrivateZepbRegistryPage() {
  const role = await readSessionRole();

  if (role && role !== "EXPERT" && role !== "LICENSE_HOLDER") {
    redirect("/settings");
  }

  return <ZepbRegistry homeHref="/landing" />;
}
