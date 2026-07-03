import cn from "classnames";
import { StarIcon, UserIcon } from "@/shared/ui/icons/interface";
import { FileTypeIcon } from "@/shared/ui/file-icon";
import { fileUrl, openFile } from "@/shared/lib/files";
import type { Order } from "@/entites/order";
import s from "./executor-screen.module.scss";
import c from "./common.module.scss";

function reviewsWord(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "отзыв";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "отзыва";
  return "отзывов";
}

export function ExecutorScreen({ order }: { order: Order }) {
  const hasExecutor = order.executor_name !== "";
  const hasOffer = order.accepted_response_id !== null;
  const rating = order.executor_rating;
  const reviewCount = order.executor_review_count;

  return (
    <>
      <div className={c.group}>
        <span className={c.blockLab}>Исполнитель</span>
        <div className={c.block}>
          {hasExecutor ? (
            <div className={s.expert}>
              <span className={s.avatar}>
                {order.executor_avatar_url ? (
                  <img src={fileUrl(order.executor_avatar_url)} alt={`Фото ${order.executor_name}`} />
                ) : (
                  <UserIcon width={22} height={22} />
                )}
              </span>
              <div className={s.expertText}>
                <span className={s.expertName}>{order.executor_name}</span>
                {rating !== null && reviewCount > 0 ? (
                  <span className={s.expertRating}>
                    <StarIcon className={s.star} />
                    {rating.toLocaleString("ru-RU", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                    {" · "}
                    {reviewCount} {reviewsWord(reviewCount)}
                  </span>
                ) : (
                  <span className={s.expertNoReviews}>Отзывов пока нет</span>
                )}
              </div>
            </div>
          ) : (
            <p className={c.comment}>Исполнитель не был выбран.</p>
          )}
        </div>
      </div>

      {hasOffer && (
        <div className={c.group}>
          <span className={c.blockLab}>Предложение исполнителя</span>
          <div className={c.block}>
            {order.executor_proposed_sum && (
              <div className={c.row}>
                <span className={c.rowLab}>Цена исполнителя</span>
                <span className={cn(c.rowVal, s.rowAccent)}>{order.executor_proposed_sum}</span>
              </div>
            )}
            {order.executor_proposed_start_date && (
              <div className={c.row}>
                <span className={c.rowLab}>Срок начала выполнения работ</span>
                <span className={c.rowVal}>{order.executor_proposed_start_date}</span>
              </div>
            )}
            {order.executor_proposed_deadline && (
              <div className={c.row}>
                <span className={c.rowLab}>Срок окончания выполнения работ</span>
                <span className={c.rowVal}>{order.executor_proposed_deadline}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {hasOffer && order.executor_comment && (
        <div className={c.group}>
          <span className={c.blockLab}>Комментарий исполнителя</span>
          <div className={c.block}>
            <p className={c.comment}>{order.executor_comment}</p>
          </div>
        </div>
      )}

      {hasOffer && order.executor_files.length > 0 && (
        <div className={c.group}>
          <span className={c.blockLab}>Файлы отклика</span>
          <div className={s.fileList}>
            {order.executor_files.map((f, i) => (
              <button key={i} className={s.fileItem} onClick={() => openFile(f)}>
                <FileTypeIcon name={f} className={s.fileIcon} />
                <span className={s.fileName}>{f.split("/").pop() || "файл"}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
