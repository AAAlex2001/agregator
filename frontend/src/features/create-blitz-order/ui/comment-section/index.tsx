import { Field } from "@/shared/ui/field";
import { FormSection } from "@/shared/ui/form-section";
import { TextArea } from "@/shared/ui/text-area";

/** Комментарий и его изменение. */
interface CommentSectionProps {
  comment: string;
  onChange: (value: string) => void;
}

/** Что ещё важно знать эксперту: последний шаг перед отправкой. */
export function CommentSection({ comment, onChange }: CommentSectionProps) {
  return (
    <FormSection
      title="Комментарий"
      hint="Необязательно. После отправки заявку получат эксперты с подходящими удостоверениями"
    >
      <Field label="Что важно знать эксперту">
        <TextArea
          value={comment}
          rows={5}
          maxLength={4000}
          placeholder="Сроки, особенности объекта, на что обратить внимание"
          onChange={(event) => onChange(event.target.value)}
        />
      </Field>
    </FormSection>
  );
}