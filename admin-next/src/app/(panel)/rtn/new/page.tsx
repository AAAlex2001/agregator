import ClarificationEditor from "@/widgets/admin/clarification-editor";

/** Новое разъяснение; с ?fromQuestion=<id> — ответ на вопрос посетителя. */
export default async function NewClarificationRoute({
  searchParams,
}: {
  searchParams: Promise<{ fromQuestion?: string }>;
}) {
  const { fromQuestion } = await searchParams;
  const questionId = Number(fromQuestion);

  return (
    <ClarificationEditor
      clarificationId={null}
      fromQuestionId={Number.isInteger(questionId) && questionId > 0 ? questionId : null}
    />
  );
}
