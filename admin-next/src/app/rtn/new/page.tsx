import { RtnClarificationForm } from "@/features/rtn-clarification-form/RtnClarificationForm";

export default function NewRtnClarificationPage({
  searchParams,
}: {
  searchParams: { fromQuestion?: string };
}) {
  const fromQuestionId = searchParams.fromQuestion ? Number(searchParams.fromQuestion) : null;
  return <RtnClarificationForm id={null} fromQuestionId={fromQuestionId} />;
}
