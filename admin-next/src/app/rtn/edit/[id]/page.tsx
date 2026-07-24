import { RtnClarificationForm } from "@/features/rtn-clarification-form/RtnClarificationForm";

export default function EditRtnClarificationPage({ params }: { params: { id: string } }) {
  return <RtnClarificationForm id={Number(params.id)} />;
}
