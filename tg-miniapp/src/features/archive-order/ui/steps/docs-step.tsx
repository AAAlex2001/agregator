import { Field, FileRow } from "@/shared/ui";
import s from "./docs-step.module.scss";

export function DocsStep({ docs }: { docs: string[] }) {
  return (
    <Field label="Документы заказчика">
      <div className={s.files}>
        {docs.map((url) => (
          <FileRow key={url} url={url} />
        ))}
      </div>
    </Field>
  );
}
