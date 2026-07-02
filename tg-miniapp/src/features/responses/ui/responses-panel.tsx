import { Spinner } from "@/shared/ui";
import { ResponseCard, type ResponseTab } from "@/entites/response";
import { useResponses } from "../model/useResponses";
import s from "./responses-panel.module.scss";

export function ResponsesPanel({ tab }: { tab: ResponseTab }) {
  const r = useResponses(tab);

  if (r.items === null) {
    return (
      <div className={s.feedLoading}>
        <Spinner />
      </div>
    );
  }
  if (r.items.length === 0) {
    return <p className={s.emptyLine}>В этой вкладке пока пусто</p>;
  }

  return (
    <div className={s.feed}>
      {r.items.map((resp) => (
        <ResponseCard
          key={resp.id}
          response={resp}
          busy={r.busyId === resp.id}
          onWithdraw={r.withdraw}
          onRestore={r.restore}
        />
      ))}
    </div>
  );
}
