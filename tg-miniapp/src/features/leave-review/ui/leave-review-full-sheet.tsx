import { Button, FullSheet, SheetHero, TextArea } from "@/shared/ui";
import { useLeaveReview } from "../model/use-leave-review";
import { RatingStars } from "./rating-stars";
import s from "./leave-review-full-sheet.module.scss";

export interface ReviewTarget {
  responseId: number;
  expertName: string;
  orderTitle: string;
}

interface Props {
  target: ReviewTarget | null;
  onClose: () => void;
  onSubmitted: () => void;
}

export function LeaveReviewFullSheet({ target, onClose, onSubmitted }: Props) {
  const open = target !== null;
  const { state, dispatch, canSubmit, submit } = useLeaveReview(target?.responseId ?? null, open, () => {
    onSubmitted();
    onClose();
  });

  return (
    <FullSheet
      open={open}
      onClose={onClose}
      hero={
        target && (
          <SheetHero
            light="/profile-hero/expert-light.webp"
            dark="/profile-hero/expert-dark.webp"
            label="Отзыв об исполнителе"
            title={target.expertName}
            desc={`Заказ «${target.orderTitle}»`}
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
      {target && (
        <div className={s.body}>
          <p className={s.hint}>
            Оцените работу исполнителя {target.expertName} — отзыв увидят другие заказчики.
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
