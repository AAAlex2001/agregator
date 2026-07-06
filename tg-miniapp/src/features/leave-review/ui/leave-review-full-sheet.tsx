import { Button, FullSheet, SheetHero, TextArea } from "@/shared/ui";
import type { Order } from "@/entites/order";
import { useLeaveReview } from "../model/use-leave-review";
import { RatingStars } from "./rating-stars";
import s from "./leave-review-full-sheet.module.scss";

interface Props {
  order: Order | null;
  onClose: () => void;
  onSubmitted: () => void;
}

export function LeaveReviewFullSheet({ order, onClose, onSubmitted }: Props) {
  const open = order !== null;
  const { state, dispatch, canSubmit, submit } = useLeaveReview(order?.accepted_response_id ?? null, open, () => {
    onSubmitted();
    onClose();
  });

  return (
    <FullSheet
      open={open}
      onClose={onClose}
      hero={
        order && (
          <SheetHero
            light="/profile-hero/expert-light.webp"
            dark="/profile-hero/expert-dark.webp"
            label="Отзыв об исполнителе"
            title={order.executor_name}
            desc={`Заказ «${order.title}»`}
            onClose={onClose}
          />
        )
      }
      footer={
        <>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button disabled={!canSubmit} loading={state.busy} onClick={() => void submit()}>
            Отправить отзыв
          </Button>
        </>
      }
    >
      {order && (
        <div className={s.body}>
          <p className={s.hint}>
            Оцените работу исполнителя {order.executor_name} — отзыв увидят другие заказчики.
          </p>
          <RatingStars value={state.rating} onChange={(value) => dispatch({ type: "rating", value })} />
          <TextArea
            placeholder="Расскажите о качестве работы, сроках и общении…"
            value={state.comment}
            onChange={(e) => dispatch({ type: "comment", value: e.target.value })}
            maxLength={5000}
          />
        </div>
      )}
    </FullSheet>
  );
}
