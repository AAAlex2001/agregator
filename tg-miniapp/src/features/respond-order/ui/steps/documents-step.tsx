import { DocumentsGrid, type Order } from "@/entites/order";
import c from "./common.module.scss";

export function DocumentsStep({ order }: { order: Order }) {
  const docs = order.documents;
  const hasAny = docs
    ? [...docs.technical, ...docs.contract, ...docs.company, ...docs.other].length > 0
    : false;

  return (
    <div className={c.step}>
      <span className={c.blockLab}>Документы заказчика</span>
      <DocumentsGrid documents={docs} />
      <p className={c.note}>
        {hasAny ? "Нажмите на документ, чтобы открыть." : "Заказчик пока не приложил документы."}
      </p>
    </div>
  );
}
