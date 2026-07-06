import { BottomSheet, Button, TextArea } from "@/shared/ui";
import { ReviewStarIcon } from "@/shared/ui/icons/interface";
import { tapHaptic } from "@/shared/services/telegram";
import { useLeaveReview } from "../model/use-leave-review";
import s from "./leave-review-sheet.module.scss";

interface Props {
  open: boolean;
  responseId: number | null;
  expertName: string;
  onClose: () => void;
  onSubmitted: () => void;
}

const STARS = [1, 2, 3, 4, 5];

export function LeaveReviewSheet({ open, responseId, expertName, onClose, onSubmitted }: Props) {
  const { state, dispatch, canSubmit, submit } = useLeaveReview(responseId, open, () => {
    onSubmitted();
    onClose();
  });

  return (
    <BottomSheet open={open} title="Оставить отзыв" onClose={onClose}>
      <div className={s.wrap}>
        <p className={s.hint}>Оцените работу исполнителя {expertName} — отзыв увидят другие заказчики.</p>
        <div className={s.stars}>
          {STARS.map((value) => (
            <button
              key={value}
              type="button"
              className={s.star}
              aria-label={`Оценка ${value}`}
              onClick={() => {
                tapHaptic();
                dispatch({ type: "rating", value });
              }}
            >
              <ReviewStarIcon active={value <= state.rating} width={32} height={32} />
            </button>
          ))}
        </div>
        <TextArea
          placeholder="Расскажите о качестве работы, сроках и общении…"
          value={state.comment}
          onChange={(e) => dispatch({ type: "comment", value: e.target.value })}
          maxLength={5000}
        />
        <div className={s.actions}>
          <Button variant="outline" onClick={onClose}>
            Отмена
          </Button>
          <Button disabled={!canSubmit} loading={state.busy} onClick={() => void submit()}>
            Отправить отзыв
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
