import { DocumentsGrid, type Order } from "@/entites/order";
import c from "./common.module.scss";

export function DocumentsScreen({ order }: { order: Order }) {
  const docs = order.documents;
  const hasAny = [...docs.technical, ...docs.contract, ...docs.company, ...docs.other].length > 0;

  return (
    <div className={c.group}>
      <span className={c.blockLab}>Документы заказчика</span>
      <DocumentsGrid documents={docs} />
      <span className={c.note}>
        {hasAny ? "Нажмите на документ, чтобы открыть." : "Заказчик не приложил документы."}
      </span>
    </div>
  );
}
