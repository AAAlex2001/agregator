import { parseId } from "@/shared/lib/route-params";
import ClarificationEditor from "@/widgets/admin/clarification-editor";

/** Редактирование разъяснения. */
export default async function ClarificationRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <ClarificationEditor key={id} clarificationId={parseId(id)} />;
}
